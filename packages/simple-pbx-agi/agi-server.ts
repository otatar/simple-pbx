import { Logger } from "tslog";
import { AGIChannel, AGIServer } from "./agi-lib";
import { SimpleCall } from "./simple-call";

const log = new Logger();
const agi = new AGIServer({});
log.info("Agi server started");

agi.on("call", async (call: AGIChannel) => {
  log.info("New Call!");
  log.trace("Call object received from asterisk: ", JSON.stringify(call, null, 2));

  const simpleCall = new SimpleCall(
    call.accountcode ?? "",
    call.callerid ?? "",
    call.extension ?? ""
  );

  //Get source
  await simpleCall.getCallSource();
  if (simpleCall.callSource.type === "unknown") {
    log.error("Call from unexpected location, dropping...");
    call.Hangup();
  }
  // Handle outgoing call
  if (simpleCall.callSource.type === "extension") {
    log.info("Call from extension, outgoing call");

    //Do outgoing routing
    await simpleCall.outgoingCallRouting();

    if (simpleCall.callDestination.type === "unknown") {
      log.warn(`Call to unexpected location: ${simpleCall.origBNumber}, dropping...`);
      call.Exec("Hangup", "1");
      await simpleCall.insertCdr(0, "NOTFOUND");
      return false;
    }
    if (simpleCall.callDestination.type === "forbidden") {
      log.warn(`The extension doesn't have privilege for this type of call, dropping...`);
      call.Exec("Hangup", "52");
      await simpleCall.insertCdr(0, "FORBIDDEN");
      return false;
    }

    log.info("Call to", simpleCall.callDestination.type);

    //Number manipulation
    await simpleCall.numberManipulation();

    //Do the calling
    log.debug(
      `The extension: ${simpleCall.origANumber} (${simpleCall.manANumber}) is calling: ${simpleCall.manBNumber}`
    );
    const dialString = await simpleCall.getDialString();
    await call.Set(`CALLERID(number)=${simpleCall.manANumber}`);
    await call.Dial(dialString);
    const status = String(await call.getVariable("DIALSTATUS"));
    const duration = Number(await call.getVariable("ANSWEREDTIME"));
    await simpleCall.insertCdr(duration, status);
    await call.Hangup();

    //Handle incoming call from trunk
  } else if (simpleCall.callSource.type === "trunk") {
    log.info("Call from trunk, incoming call");

    //Number manipulation
    await simpleCall.numberManipulation("inbound");

    //Incoming routing
    await simpleCall.incomingCallRouting();

    if (simpleCall.callDestination.type === "unknown") {
      log.warn(`Call to unexpected location: ${simpleCall.manBNumber}, dropping...`);
      call.Exec("Hangup", "1");
      simpleCall.insertCdr(0, "NOTFOUND");
      return false;
    }

    log.info("Call to", simpleCall.callDestination.type);
    if (simpleCall.callDestination.type === "extension") {
      simpleCall.manBNumber = simpleCall.callDestination.destination.extension;
    }

    //Do the calling
    log.debug(
      `The call from trunk: ${simpleCall.callSource.source.name} to ${simpleCall.callDestination.type} ${simpleCall.manBNumber}`
    );
    const dialString = await simpleCall.getDialString();
    await call.Set(`CALLERID(number)=${simpleCall.manANumber}`);
    await call.Dial(dialString);
    const status = String(await call.getVariable("DIALSTATUS"));
    const duration = Number(await call.getVariable("ANSWEREDTIME"));
    await simpleCall.insertCdr(duration, status);
    await call.Hangup();
  }

  call.on("hangup", () => {
    log.info(`Hangup  ${call.remoteServer}/${call.channel}`);
  });

  call.on("error", (err) => {
    log.error(`ERROR: ${call.remoteServer}/${call.channel}: ${err}`);
  });
});

agi.on("error", (error) => {
  log.fatal("Fatal error: ", error);
});
