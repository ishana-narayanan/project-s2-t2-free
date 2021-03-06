import { authenticatedAction } from "../../../../utils/api";
import { initDatabase } from "../../../../utils/mongodb";
import { numToTime } from "../../../../utils/timeFuncs";

async function editSleepEvents(event, userSub) {
  const client = await initDatabase();
  const events = client.collection("events");

  //Remove Sleep Event
  const query = {
    name: "",
    userid: userSub,
  };

  const result = await events.deleteMany(query);

  // Create Sleep Event
  const query1 = { name: "always insert event" };
  const mutation = {
    $setOnInsert: {
      userid: userSub,
      name: "",
      isMonday: true,
      isTuesday: true,
      isWednesday: true,
      isThursday: true,
      isFriday: true,
      isSaturday: true,
      isSunday: true,
      startTime: "12:00 AM",
      endTime: event.startTime,
    },
  };

  const result0 = await events.findOneAndUpdate(query1, mutation, {
    upsert: true,
    returnOriginal: false,
  });

  const mutation1 = {
    $setOnInsert: {
      userid: userSub,
      name: "",
      isMonday: true,
      isTuesday: true,
      isWednesday: true,
      isThursday: true,
      isFriday: true,
      isSaturday: true,
      isSunday: true,
      startTime: event.endTime,
      endTime: "11:55 PM",
    },
  };

  const result1 = await events.findOneAndUpdate(query1, mutation1, {
    upsert: true,
    returnOriginal: false,
  });
  return result0.value && result1.value; // what are these functions returning?
}

export async function getSleepEvents(userSub) {
  const client = await initDatabase();
  const events = client.collection("events");
  const query = {
    userid: userSub,
    name: "",
  };
  return await events.find(query).toArray();
}

async function performAction(req, user) {
  switch (req.method) {
    case "POST":
      return editSleepEvents(req.body, user.sub);
    case "GET":
      return getSleepEvents(user.sub);
  }
  throw { status: 405 };
}

export default authenticatedAction(performAction);
