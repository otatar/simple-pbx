import { db } from "./libs/__mocks__/db";
import { SimpleCall, type CallDestination } from "./simple-call";
import type { ClassOfService, Extension, OutgoingRoute, Trunk, TrunkGroup } from "@prisma/client";

vi.mock("./libs/db");

describe("isRouteMatch testing", () => {
  const simpleCall = new SimpleCall("were", "1234", "4565");
  it("should return true for matching prefix 123 with phone number 1234567", () => {
    expect(simpleCall.isRouteMatch("123456", "123")).toBe(true);
  });

  it("should return false for matching prefix 123 with phone number 56789", () => {
    expect(simpleCall.isRouteMatch("56789", "123")).toBe(false);
  });

  it("should return true for matching prefix 123xxx with phone number 123456", () => {
    expect(simpleCall.isRouteMatch("123456", "123xxx")).toBe(true);
  });

  it("should return true for matching prefix 123XXX with phone number 123456", () => {
    expect(simpleCall.isRouteMatch("123456", "123XXX")).toBe(true);
  });

  it("should return false for matching prefix 123XXX with phone number 1234567", () => {
    expect(simpleCall.isRouteMatch("1234567", "123XXX")).toBe(false);
  });

  it("should return false for matching prefix XXX with phone number 123456", () => {
    expect(simpleCall.isRouteMatch("123456", "XXX")).toBe(false);
  });

  it("should return true for matching prefix XXX with phone number 999", () => {
    expect(simpleCall.isRouteMatch("999", "XXX")).toBe(true);
  });

  it("should return false for matching prefix 123XXX with phone number abcdf", () => {
    expect(simpleCall.isRouteMatch("abcdf", "123XXX")).toBe(false);
  });
});

describe("outgoingCallRouting method testing", () => {
  it("should return extension destination", async () => {
    const simpleCall = new SimpleCall("", "1234", "111");
    db.extension.findFirst.mockResolvedValue({
      id: 1,
      name: "test",
      email: "test",
      extension: "111",
      password: "pass",
      cosId: 1,
      callRecord: "no",
      phoneBook: "yes",
      language: "en",
      createdBy: "test",
      createdAt: new Date(),
    });

    await simpleCall.outgoingCallRouting();

    expect(simpleCall.callDestination).toBeTruthy();
    expect(simpleCall.callDestination.type).toBe("extension");
    expect(simpleCall.callDestination.destination).toBeTruthy();
    expect(simpleCall.callDestination.destination).toBeTypeOf("object");
  });

  it("should return unknown destination, no routes in database", async () => {
    const simpleCall = new SimpleCall("", "1234", "111");
    db.extension.findFirst.mockResolvedValue(null);
    db.outgoingRoute.findMany.mockResolvedValue([]);
    await simpleCall.outgoingCallRouting();

    expect(simpleCall.callDestination).toBeTruthy();
    expect(simpleCall.callDestination.type).toBe("unknown");
  });

  it("should return unknown destination, no match in database, one entries", async () => {
    const simpleCall = new SimpleCall("", "1234", "111");
    db.extension.findFirst.mockResolvedValue(null);
    db.outgoingRoute.findMany.mockResolvedValue([
      {
        id: 1,
        name: "out",
        prefix: "00XXXXXXXX",
        destinationType: "trunk",
        trunkGroupId: 1,
        createdAt: new Date(),
        createdBy: "test",
        cosId: 5,
        trunkId: 1,
      },
    ]);
    await simpleCall.outgoingCallRouting();

    expect(simpleCall.callDestination).toBeTruthy();
    expect(simpleCall.callDestination.type).toBe("unknown");
  });

  it("should return unknown destination, no match in database, more entries", async () => {
    const simpleCall = new SimpleCall("", "1234", "111");
    db.extension.findFirst.mockResolvedValue(null);
    db.outgoingRoute.findMany.mockResolvedValue([
      {
        id: 1,
        name: "out",
        prefix: "00XXXXXXXX",
        destinationType: "trunk",
        trunkGroupId: 1,
        createdAt: new Date(),
        createdBy: "test",
        cosId: 5,
        trunkId: 1,
      },
      {
        id: 1,
        name: "out",
        prefix: "00XXXXXXXXXX",
        destinationType: "trunk",
        trunkGroupId: 1,
        createdAt: new Date(),
        createdBy: "test",
        cosId: 5,
        trunkId: 1,
      },
      {
        id: 1,
        name: "out",
        prefix: "00XX",
        destinationType: "trunk",
        trunkGroupId: 1,
        createdAt: new Date(),
        createdBy: "test",
        cosId: 5,
        trunkId: 1,
      },
    ]);
    await simpleCall.outgoingCallRouting();

    expect(simpleCall.callDestination).toBeTruthy();
    expect(simpleCall.callDestination.type).toBe("unknown");
  });

  it("should return trunk destination", async () => {
    const simpleCall = new SimpleCall("", "1234", "0036753090");
    db.extension.findFirst.mockResolvedValue(null);
    db.outgoingRoute.findMany.mockResolvedValue([
      {
        id: 1,
        name: "out",
        prefix: "00XXXXXXXX",
        destinationType: "trunk",
        trunkGroupId: 1,
        createdAt: new Date(),
        createdBy: "test",
        cosId: 5,
        trunkId: 1,
      },
    ]);
    db.trunk.findUnique.mockResolvedValue({
      id: 1,
      name: "test",
      createdAt: new Date(),
      createdBy: "test",
      password: null,
      provider: null,
      host: "",
      port: null,
      username: null,
      registration: "yes",
      serverUri: null,
      clientUri: null,
      qualifyFrequency: null,
    });
    await simpleCall.outgoingCallRouting();

    expect(simpleCall.callDestination).toBeTruthy();
    expect(simpleCall.callDestination.type).toBe("trunk");
  });

  it("should return forbidden destination", async () => {
    const simpleCall = new SimpleCall("", "1234", "0036753090");
    simpleCall.callSource = {
      type: "extension",
      source: {
        id: 1,
        name: "test",
        email: "test",
        extension: "111",
        password: "pass",
        cosId: 1,
        createdBy: "test",
        createdAt: new Date(),
        callRecord: "no",
        phoneBook: "yes",
        language: "en",
        cos: {
          id: 1,
          name: "test",
          cos: 5,
          createdBy: "test",
          createdAt: new Date(),
        },
      },
    };
    db.extension.findFirst.mockResolvedValue(null);
    const mockedRoute = {
      id: 1,
      name: "out",
      prefix: "00XXXXXXXX",
      destinationType: "trunk",
      trunkGroupId: 1,
      createdAt: new Date(),
      createdBy: "test",
      cosId: 5,
      trunkId: 1,
      cos: {
        id: 1,
        cos: 10,
        name: "test",
        createdAt: new Date(),
        createdBy: "test",
      },
    } as OutgoingRoute & { cos: ClassOfService };
    db.outgoingRoute.findMany.mockResolvedValue([mockedRoute]);
    db.trunk.findUnique.mockResolvedValue({
      id: 1,
      name: "test",
      createdAt: new Date(),
      createdBy: "test",
      password: null,
      provider: null,
      host: "",
      port: null,
      username: null,
      registration: "yes",
      serverUri: null,
      clientUri: null,
      qualifyFrequency: null,
    });
    await simpleCall.outgoingCallRouting();

    expect(simpleCall.callDestination).toBeTruthy();
    expect(simpleCall.callDestination.type).toBe("forbidden");
  });

  it("should return trunk group destination", async () => {
    const simpleCall = new SimpleCall("", "1234", "0036753090");
    db.extension.findFirst.mockResolvedValue(null);
    db.outgoingRoute.findMany.mockResolvedValue([
      {
        id: 1,
        name: "out",
        prefix: "00XXXXXXXX",
        destinationType: "trunkGroup",
        trunkGroupId: 1,
        createdAt: new Date(),
        createdBy: "test",
        cosId: 5,
        trunkId: 1,
      },
    ]);
    db.trunkGroup.findUnique.mockResolvedValue({
      id: 1,
      name: "test",
    });
    await simpleCall.outgoingCallRouting();

    expect(simpleCall.callDestination).toBeTruthy();
    expect(simpleCall.callDestination.type).toBe("trunkGroup");
  });
});

describe("numberManipulation method testing", () => {
  it("should not do number translation, not a trunk destination ", () => {
    const simpleCall = new SimpleCall("were", "1234", "4565");
    simpleCall.callDestination.type = "extension";
    simpleCall.numberManipulation();
    expect(simpleCall.origANumber).toEqual(simpleCall.manANumber);
    expect(simpleCall.origBNumber).toEqual(simpleCall.manBNumber);
  });
  it("should not do number translation, no translation in db", () => {
    const simpleCall = new SimpleCall("were", "1234", "4565");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([]);
    simpleCall.numberManipulation();
    expect(simpleCall.origANumber).toEqual(simpleCall.manANumber);
    expect(simpleCall.origBNumber).toEqual(simpleCall.manBNumber);
  });

  it("should not do number manipulation, no match", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "bNumber",
        priority: 1,
        match: "00387",
        stripBegin: 2,
        direction: "outbound",
        name: "test",
        prepend: "00387",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 0,
        append: "",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origANumber).toEqual(simpleCall.manANumber);
    expect(simpleCall.manBNumber).toEqual("0036753090");
  });

  it("should do number manipulation, strip and prepend to B number", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "bNumber",
        priority: 1,
        match: "0036",
        stripBegin: 2,
        direction: "outbound",
        name: "test",
        prepend: "00387",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 0,
        append: "",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origANumber).toEqual(simpleCall.manANumber);
    expect(simpleCall.manBNumber).toEqual("0038736753090");
  });
  it("should do number manipulation, strip and prepend to A number", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "aNumber",
        priority: 1,
        match: "12",
        stripBegin: 1,
        direction: "outbound",
        name: "test",
        prepend: "00387",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 0,
        append: "",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origBNumber).toEqual(simpleCall.manBNumber);
    expect(simpleCall.manANumber).toEqual("00387234");
  });
  it("should do number manipulation, strip and prepend, append to B number", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "bNumber",
        stripBegin: 2,
        direction: "outbound",
        priority: 1,
        match: "0036",
        name: "test",
        prepend: "00387",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 2,
        append: "555",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origANumber).toEqual(simpleCall.manANumber);
    expect(simpleCall.manBNumber).toEqual("00387367530555");
  });

  it("should do number manipulation, strip and prepend, append to B number", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "aNumber",
        priority: 1,
        match: "123",
        stripBegin: 2,
        name: "test",
        direction: "outbound",
        prepend: "00387",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 1,
        append: "555",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origBNumber).toEqual(simpleCall.manBNumber);
    expect(simpleCall.manANumber).toEqual("003873555");
  });

  it("should do number manipulation, strip and append stripped to B number", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "bNumber",
        priority: 1,
        match: "0036",
        direction: "outbound",
        stripBegin: 2,
        name: "test",
        prepend: "",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 0,
        append: "stripBegin",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origANumber).toEqual(simpleCall.manANumber);
    expect(simpleCall.manBNumber).toEqual("3675309000");
  });

  it("should do number manipulation, strip and prepend stripped to B number", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "bNumber",
        match: "0036",
        priority: 1,
        stripBegin: 0,
        direction: "outbound",
        name: "test",
        prepend: "stripEnd",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 2,
        append: "",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origANumber).toEqual(simpleCall.manANumber);
    expect(simpleCall.manBNumber).toEqual("9000367530");
  });
  it("should do number manipulation, strip and append, prepend stripped to A number", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "aNumber",
        match: "1",
        priority: 1,
        stripBegin: 1,
        direction: "outbound",
        name: "test",
        prepend: "stripEnd",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 1,
        append: "stripBegin",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origBNumber).toEqual(simpleCall.manBNumber);
    expect(simpleCall.manANumber).toEqual("4231");
  });

  it("should do number manipulation, real world example manipulation B number", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "bNumber",
        match: "0036",
        priority: 1,
        stripBegin: 2,
        direction: "outbound",
        name: "test",
        prepend: "00387",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 0,
        append: "",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origANumber).toEqual(simpleCall.manANumber);
    expect(simpleCall.manBNumber).toEqual("0038736753090");
  });

  it("should do number manipulation, real world example manipulation A number", async () => {
    const simpleCall = new SimpleCall("were", "1234", "0036753090");
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    };
    db.numberManipulation.findMany.mockResolvedValue([
      {
        id: 1,
        type: "aNumber",
        priority: 1,
        match: "1234",
        stripBegin: 1,
        direction: "outbound",
        name: "test",
        prepend: "+38736758",
        createdAt: new Date(),
        createdBy: "test",
        trunkId: 0,
        stripEnd: 0,
        append: "",
      },
    ]);
    await simpleCall.numberManipulation();
    expect(simpleCall.origBNumber).toEqual(simpleCall.manBNumber);
    expect(simpleCall.manANumber).toEqual("+38736758234");
  });
});

describe("getDialString method testing", () => {
  const simpleCall = new SimpleCall("were", "1234", "4565");
  it("should return string", async () => {
    db.globalSettings.findFirst.mockResolvedValue({
      id: 1,
      ringTimeout: 40,
      maxCallDuration: 18000,
      createdAt: new Date(),
      createdBy: "test",
      subBranding: "Test",
    });
    expect(await simpleCall.getDialString()).toBeTypeOf("string");
  });

  it("should return dial string with trunk", async () => {
    simpleCall.callDestination.type = "trunk";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
    } as Trunk;
    db.globalSettings.findFirst.mockResolvedValue({
      id: 1,
      ringTimeout: 40,
      maxCallDuration: 18000,
      createdAt: new Date(),
      createdBy: "test",
      subBranding: "Test",
    });
    simpleCall.manBNumber = "4565";
    const dialString = await simpleCall.getDialString();
    expect(dialString).toEqual("PJSIP/4565@test,40,L(18000000)g");
  });

  it("should return dial string with extension", async () => {
    simpleCall.callDestination.type = "extension";
    simpleCall.callDestination.destination = {
      id: 1,
      name: "test",
      email: "test",
      extension: "111",
      password: "pass",
      cosId: 1,
      createdBy: "test",
      createdAt: new Date(),
    } as Extension;
    simpleCall.manBNumber = "4565";
    db.globalSettings.findFirst.mockResolvedValue({
      id: 1,
      ringTimeout: 40,
      maxCallDuration: 18000,
      createdAt: new Date(),
      createdBy: "test",
      subBranding: "Test",
    });
    const dialString = await simpleCall.getDialString();
    expect(dialString).toEqual("PJSIP/4565,40,L(18000000)g");
  });
});
