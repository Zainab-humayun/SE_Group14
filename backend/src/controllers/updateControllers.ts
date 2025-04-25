import { Response, Request } from "express";
import prisma from "../db/prisma.js";
import { error } from "console";


export const updateUserProfilePic = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { profilePic } = req.body;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePic,
      },
    });

    res.status(200).json(user);
    return;
  } catch (err: any) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error uploading profile picture" });
    return;
  }
};




export const updateVehicleInfo = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    console.log("Req body: ", req.body);
    
    const userId = req.user?.id;
    const color = data.color;
    const name = data.name;
    const vehiclePic = data.vehiclePic;
    const model = data.model;
    const type = data.type;
    const numberPlate = data.numberPlate;
    console.log("Vehicle: ", vehiclePic);

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        userId: userId
      }
    });

    const baseData = {
      name,
      type: type || 'FOURWHEEL', // default value if not provided
      numberPlate: numberPlate || '', // empty string if not provided
      model: model || '',
      color: color || '',
    };

    if (existingVehicle) {
      const updatedVehicle = await prisma.vehicle.update({
        where: { id: existingVehicle.id },
        data: {
          ...baseData,
          vehiclePics: vehiclePic 
        }
      });
      console.log("This one: ", updatedVehicle);
      
      res.status(200).json(updatedVehicle);
      return;
    } else {
      const newVehicle = await prisma.vehicle.create({
        data: {
          ...baseData,
          userId,
          vehiclePics: vehiclePic
        }
      });

      console.log(newVehicle);
      res.status(201).json(newVehicle);
      return;
    }
  } catch (err: any) {
    console.error("Error: ", err);
    res.status(500).json({ error: "Error updating the vehicle info!" });
  }
}


export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { fullname, driver, type, phone } = req.body;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const driverBool = driver === true || driver === 'true' || driver === 'yes';

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullname,
        phone,
        driver: driverBool,
        type
      },
    });

    res.status(200).json(updatedUser);
  } catch (err: any) {
    console.error("Error updating user info:", err);
    res.status(500).json({ error: "Error updating user information" });
  }
};



export const updateRidePrice = async (req: Request, res: Response) => {
  try {
    const rideId = req.params.id;
    const newFare = req.body.fare;

    if (!rideId) {
      res.status(400).json({ error: "Ride ID is required." });
      return;
    }

    if (newFare === undefined || typeof newFare !== "number") {
      res.status(400).json({ error: "A valid new fare must be provided." });
      return;
    }

    const ride = await prisma.carpoolRequestPost.findFirst({
      where: {
        id: rideId,
        posterId: req.user?.id,
      },
    });

    if (!ride) {
      res.status(403).json({ error: "You cannot update someone else's ride or ride not found." });
      return;
    }

    const updatedRide = await prisma.carpoolRequestPost.update({
      where: { id: rideId },
      data: { cost: newFare },
    });

    res.status(200).json({ message: "Fare updated successfully", ride: updatedRide });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the ride fare." });
  }
};