// actions/recent-activity.action.ts
import Intake from "@/models/intake";
import Handling from "@/models/handling";
import Dispatch from "@/models/dispatch";
import { Activity } from "@/components/recentActivity";

export async function getRecentActivities(): Promise<Activity[]> {
  // Fetch the most recent 5 documents from each collection.
  // (You may increase the limits if needed to have enough items to merge.)
  const [intakes, handlings, dispatches] = await Promise.all([
    Intake.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    Handling.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    Dispatch.find({}).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const activities: Activity[] = [];

  // Map intakes
  intakes.forEach((doc) => {
    activities.push({
      id: doc._id.toString(),
      type: "intake",
      // Using clientId as a placeholder for "name"
      name: doc.clientId,
      commodity: doc.commodity,
      // For volume, you might choose grossWeight, netWeight, or amount.
      // Here we use netWeight.
      volume: doc.netWeight,
      moisture: doc.moistureIn,
      // Use the number of bagIds as the bag count.
      noOfBags: doc.bagIds?.length || 0,
      date: doc.createdAt,
    });
  });

  // Map handlings
  handlings.forEach((doc) => {
    activities.push({
      id: doc._id.toString(),
      type: "handling",
      // Since we don’t have a client name, use intakeId as a placeholder.
      name: doc.intakeId,
      commodity: doc.commodity,
      volume: doc.netWeight,
      moisture: doc.moistureIn,
      // You can choose bagsIn or bagsOut. Here we use bagsIn.
      noOfBags: doc.bagsIn,
      date: doc.createdAt,
    });
  });

  // Map dispatches
  dispatches.forEach((doc) => {
    activities.push({
      id: doc._id.toString(),
      type: "dispatch",
      // Using clientId as the "name"
      name: doc.clientId,
      // Assuming commodityDetails contains a commodity property
      commodity: doc.commodityDetails?.commodity || "N/A",
      volume: doc.volumeThroughWeighingScale,
      moisture: doc.moistureThroughMoistureMeter,
      noOfBags: doc.outgoingBagCountViaCameras,
      date: doc.createdAt,
    });
  });

  // Sort all activities by createdAt descending and return the top five.
  activities.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return activities.slice(0, 5);
}
