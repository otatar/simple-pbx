import type { ClassOfService, Extension, Trunk, TrunkGroup } from "@prisma/client";
import { Logger } from "tslog";
import { db } from "./libs/db";

const log = new Logger();

export class SimpleCall {
  accountCode: string;
  callSource = {} as CallSource;
  callDestination = {} as CallDestination;
  manANumber?: string;
  manBNumber?: string;
  origANumber: string;
  origBNumber: string;
  startTime: Date;

  constructor(accountCode: string, origANumber: string, origBNumber: string) {
    this.accountCode = accountCode;
    this.origANumber = origANumber;
    this.origBNumber = origBNumber;
    this.startTime = new Date();
  }

  async getCallSource() {
    log.debug("Determining the call source...");
    if (this.accountCode !== "") {
      log.trace("Checking for trunk in DB with account code:", this.accountCode);
      const trunk = await db.trunk.findFirst({
        where: {
          accountCode: this.accountCode,
        },
      });
      if (trunk) {
        this.callSource.type = "trunk";
        this.callSource.source = trunk;
      }
    } else {
      //Possible call from extension
      log.trace("Checking for extension in DB");
      const extension = await db.extension.findFirst({
        include: { cos: true },
        where: {
          extension: this.origANumber,
        },
      });

      if (extension) {
        this.callSource.type = "extension";
        this.callSource.source = extension;
      } else {
        log.warn("Unknown call source, call from: ", this.origANumber);
        this.callSource.type = "unknown";
      }
    }

    log.debug("Call from:", this.callSource);
  }

  async outgoingCallRouting() {
    log.debug("Routing procedure starting...");
    log.debug("Checking if this is a call to extension");
    const extension = await db.extension.findFirst({
      where: {
        extension: this.origBNumber,
      },
    });
    if (extension) {
      this.callDestination.type = "extension";
      this.callDestination.destination = extension;
    } else {
      log.debug("Looking in routes from database");
      const routes = await db.outgoingRoute.findMany({
        include: { cos: true },
      });
      for (const route of routes) {
        log.trace(
          `Trying to get match for called number: ${this.origBNumber} and route prefix: ${route.prefix}`
        );
        const routeMatch = this.isRouteMatch(this.origBNumber, route.prefix);
        if (routeMatch) {
          //Bingo
          log.trace("We have a match with route:", route);
          //Check class of dialing if call is form extension
          if (
            this.callSource.type === "extension" &&
            route.cos.cos >= this.callSource.source.cos.cos
          ) {
            log.warn(
              `Extension cos: ${this.callSource.source.cos.cos} is lower than route cos: ${route.cos.cos}`
            );
            this.callDestination.type = "forbidden";
            continue;
          }
          if (route.destinationType == "trunk") {
            // Handle destination trunk
            this.callDestination.destination = await db.trunk.findUnique({
              where: { id: route.trunkId! },
            });
            if (!this.callDestination.destination) {
              log.warn("Cannot find trunk in database with id: ", route.trunkId);
              this.callDestination.type = "unknown";
            }
            this.callDestination.type = route.destinationType;
            log.trace("Destination trunk:", this.callDestination);
            // Handle destination group
          } else if (route.destinationType == "trunkGroup") {
            this.callDestination.destination = await db.trunkGroup.findUnique({
              where: { id: route.trunkGroupId! },
            });
            if (!this.callDestination.destination) {
              log.warn("Cannot find trunk group in database with id: ", route.trunkId);
              this.callDestination.type = "unknown";
            }
            this.callDestination.type = route.destinationType;
            log.trace("Destination trunk group:", this.callDestination);
          }
          //we found something, break
          break;
        }
        log.debug("No match");
      }

      if (this.callDestination.type === undefined) {
        log.debug(
          "There is no route in the database to destination phone number: ",
          this.origBNumber
        );
        this.callDestination = {
          type: "unknown",
          destination: null,
        };
      } else if (this.callDestination.type === "forbidden") {
        log.debug("There are no allowed routes for this call");
      } else {
        log.debug(`Call to ${this.callDestination.type}:`, this.callDestination.destination);
      }
    }
  }

  isRouteMatch(dialedNumber: string, prefix: string): boolean {
    //Analyze prefix
    const analyzedPrefix = prefix.match(/^(\d*)([xX]*)$/);
    if (!analyzedPrefix) return false;
    if (analyzedPrefix[2].length > 0) {
      if (dialedNumber.startsWith(analyzedPrefix[1]) && dialedNumber.length == prefix.length)
        return true;
    } else {
      if (dialedNumber.startsWith(analyzedPrefix[1])) return true;
    }

    return false;
  }

  async incomingCallRouting() {
    log.debug("Incoming call routing starting...");

    log.debug("Looking in incoming routes from database");
    const routes = await db.incomingRoute.findMany({});

    for (const route of routes) {
      log.trace(
        `Trying to get match for called number: ${this.manBNumber} and route prefix: ${route.prefix}`
      );
      const routeMatch = this.isRouteMatch(this.manBNumber!, route.prefix);
      if (routeMatch) {
        //Bingo
        log.trace("We have a match with route:", route);
        if (route.destinationType == "trunk") {
          // Handle destination trunk
          this.callDestination.destination = await db.trunk.findUnique({
            where: { id: route.trunkId! },
          });
          if (!this.callDestination.destination) {
            log.warn("Cannot find trunk in database with id: ", route.trunkId);
            this.callDestination.type = "unknown";
          }
          this.callDestination.type = route.destinationType;
          log.trace("Destination trunk:", this.callDestination);
        } else if (route.destinationType == "trunkGroup") {
          // Handle destination group
          this.callDestination.destination = await db.trunkGroup.findUnique({
            where: { id: route.trunkGroupId! },
          });
          if (!this.callDestination.destination) {
            log.warn("Cannot find trunk group in database with id: ", route.trunkGroupId);
            this.callDestination.type = "unknown";
          }
        } else if (route.destinationType == "extension") {
          // Handle destination extension
          this.callDestination.destination = await db.extension.findUnique({
            where: { id: route.extensionId! },
          });

          if (!this.callDestination.destination) {
            log.warn("Cannot find extension in database with id: ", route.extensionId);
            this.callDestination.type = "unknown";
          }
          this.callDestination.type = "extension";
        }
        //we found something, break
        break;
      }
    }
    if (this.callDestination.type === undefined) {
      log.info("There is no route in the database to destination phone number: ", this.manBNumber);
      this.callDestination = {
        type: "unknown",
        destination: null,
      };
    }
  }

  async numberManipulation(direction: "outbound" | "inbound" = "outbound") {
    log.debug(`Number manipulation starting, direction: ${direction} ...`);
    this.manANumber = this.origANumber;
    this.manBNumber = this.origBNumber;

    if (this.callDestination.type !== "trunk") {
      log.warn("Number manipulation is only applicable for trunks");
      return;
    }

    const numberManipulation = await db.numberManipulation.findMany({
      where: {
        trunkId: this.callDestination.destination.id,
        direction,
      },
      orderBy: {
        priority: "asc",
      },
    });
    for (const manipulation of numberManipulation) {
      log.trace(
        `A number: ${this.manANumber}, B number: ${this.manBNumber}, manipulation:`,
        manipulation
      );
      //Handle A number manipulation
      if (manipulation.type === "aNumber") {
        if (this.manANumber.startsWith(manipulation.match!)) {
          log.debug("A number manipulation match");
          const stripBegin: string = this.manANumber.slice(0, manipulation.stripBegin);
          const stripEnd: string = this.manANumber.slice(-manipulation.stripEnd);
          //Slice the number
          if (manipulation.stripEnd != 0) {
            this.manANumber = this.manANumber.slice(
              manipulation.stripBegin,
              -manipulation.stripEnd
            );
          } else {
            this.manANumber = this.manANumber.slice(manipulation.stripBegin);
          }
          if (manipulation.prepend === "stripBegin") {
            this.manANumber = stripBegin + this.manANumber;
          } else if (manipulation.prepend === "stripEnd") {
            this.manANumber = stripEnd + this.manANumber;
          } else {
            this.manANumber = manipulation.prepend + this.manANumber;
          }
          if (manipulation.append === "stripBegin") {
            this.manANumber = this.manANumber + stripBegin;
          } else if (manipulation.append === "stripEnd") {
            this.manANumber = this.manANumber + stripEnd;
          } else {
            this.manANumber = this.manANumber + manipulation.append;
          }
        } else {
          log.debug("A number manipulation no match");
        }
        //Handle B number manipulation
      } else if (manipulation.type === "bNumber") {
        if (this.manBNumber.startsWith(manipulation.match!)) {
          log.debug("B number manipulation match");
        } else {
          log.debug("B number manipulation no match");
          continue;
        }
        const stripBegin: string = this.manBNumber.slice(0, manipulation.stripBegin);
        const stripEnd: string = this.manBNumber.slice(-manipulation.stripEnd);
        //Slice the number
        if (manipulation.stripEnd != 0) {
          this.manBNumber = this.manBNumber.slice(manipulation.stripBegin, -manipulation.stripEnd);
        } else {
          this.manBNumber = this.manBNumber.slice(manipulation.stripBegin);
        }

        if (manipulation.prepend === "stripBegin") {
          this.manBNumber = stripBegin + this.manBNumber;
        } else if (manipulation.prepend === "stripEnd") {
          this.manBNumber = stripEnd + this.manBNumber;
        } else {
          this.manBNumber = manipulation.prepend + this.manBNumber;
        }
        if (manipulation.append === "stripBegin") {
          this.manBNumber = this.manBNumber + stripBegin;
        } else if (manipulation.append === "stripEnd") {
          this.manBNumber = this.manBNumber + stripEnd;
        } else {
          this.manBNumber = this.manBNumber + manipulation.append;
        }
      }
    }
    log.debug(
      `Number manipulation finished, A number: ${this.manANumber}, B number: ${this.manBNumber}`
    );
  }

  async getDialString() {
    let dialString = "";
    const globalSettings = await db.globalSettings.findFirst();
    const timeout = globalSettings?.ringTimeout ?? 40;
    const maxCallDuration = globalSettings?.maxCallDuration
      ? globalSettings.maxCallDuration * 1000
      : 5 * 60 * 60 * 1000;
    if (this.callDestination.type === "extension") {
      dialString = `PJSIP/${this.callDestination.destination.extension},${timeout},L(${maxCallDuration})g`;
    } else if (this.callDestination.type === "trunk") {
      dialString = `PJSIP/${this.manBNumber}@${this.callDestination.destination.name},${timeout},L(${maxCallDuration})g`;
    } else if (this.callDestination.type === "trunkGroup") {
      //TODO: implement trunk group dialing
    }
    console.log(dialString);
    return dialString;
  }

  async insertCdr(duration: number, dialStatus: string) {
    log.debug("Saving CDR to database...");
    console.info(
      `Call from ${this.origANumber} to ${this.origBNumber}, duration: ${duration}, status: ${dialStatus}`
    );
    await db.cdr.create({
      data: {
        origANumber: this.origANumber,
        origBNumber: this.origBNumber,
        manANumber: this.manANumber,
        manBNumber: this.manBNumber,
        sourceType: this.callSource.type,
        destinationType: this.callDestination.type,
        sourceTrunk: this.callSource.type === "trunk" ? this.callSource.source.name : "",
        destinationTrunk:
          this.callDestination.type === "trunk" ? this.callDestination.destination.name : "",
        startTime: this.startTime,
        duration,
        dialStatus,
      },
    });
  }
}

type CallSource =
  | {
      type: "extension";
      source: Extension & { cos: ClassOfService };
    }
  | {
      type: "trunk";
      source: Trunk;
    }
  | {
      type: "unknown";
      source: null;
    };

export type CallDestination =
  | {
      type: "extension";
      destination: Extension;
    }
  | {
      type: "trunk";
      destination: Trunk;
    }
  | {
      type: "trunkGroup";
      destination: TrunkGroup;
    }
  | {
      type: "queue";
      destination: Extension;
    }
  | {
      type: "forbidden";
      destination: null;
    }
  | {
      type: "unknown";
      destination: null;
    };
