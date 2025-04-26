import { Request, Response } from "express";
import prisma from "../db/prisma.js";



export const createComplain = async (req: Request, res: Response) => {
  try {
    const { targetId, complain } = req.body;

  
    if (!targetId || !complain) {
      res.status(400).json({ error: "Target ID and complaint message are required" });
      return;
    }

    const complainerId = req.user?.id;
    if (!complainerId) {
      res.status(401).json({ error: "Unauthorized access" });
      return;
    }

    if (targetId === complainerId) {
      res.status(400).json({ error: "You cannot file a complaint against yourself" });
      return;
    }

  
    const targetUser = await prisma.user.findUnique({
      where: { id: targetId }
    });

    if (!targetUser) {
      res.status(404).json({ error: "Target user not found" });
      return;
    }

    const newComplain = await prisma.complain.create({
      data: {
        target: { connect: { id: targetId } },
        complainer: { connect: { id: complainerId } },
        complain: complain.trim() 
      },
      include: {
        target: {
          select: {
            id: true,
            username: true
          }
        },
        complainer: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    res.status(201).json({
      id: newComplain.id,
      complain: newComplain.complain,
      createdAt: newComplain.createdAt,
      target: newComplain.target,
      complainer: newComplain.complainer
    });
    return;

  } catch (err: any) {
    console.error("Error creating complaint:", err);
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
    return;
  }
};

export const getComplains = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const complains = await prisma.complain.findMany({
      where: {
        targetId: userId
      },
      include: {
        complainer: true, 
      }
    });

    res.status(200).json(complains);
  } catch (err: any) {
    console.error("Error fetching complains:", err);
    res.status(500).json({ error: "Internal server error! Could not fetch the complains" });
  }
};


export const getSearchedUserResults = async (req: Request, res: Response) => {
  try {
    const queryParas = req.body.para;

    if (!queryParas) {
      res.status(400).json("Invalid search parameters!");
      return;
    }
    let users:any = [];

    if (queryParas.length >= 3) {
      users = await prisma.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: queryParas,
                mode: 'insensitive', 
              },
            },
            {
              fullname: {
                contains: queryParas,
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {id:true, username:true, fullname:true, profilePic:true, driver:true, type:true}
      });
    }

    res.status(200).json(users);
    
  } catch (err: any) {
    res.status(500).json("Something went wrong while fetching users!");
  }
}


export const getUserProfile = async (req: Request, res: Response) => {
    try {
    const userId = req.params.userId;


    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id:true,
        username: true, 
        fullname: true,
        isAdmin: true,
        driver: true,
        profilePic: true,
        vehicles: true,
        isSuspended: true,
        type: true,
        complains: true,
        reviews: true,
        rating: true,
        phone: true,
        gender:true
        
      }
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};



export const getTrendingUsers = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const targetIsDriver = !currentUser.driver;

    const users = await prisma.user.findMany({
      where: { driver: targetIsDriver },
      orderBy: { rating: 'desc' },
      take: 10,
      select: {
        id: true,
        fullname: true,
        username: true,
        profilePic: true,
        rating: true,
        type: true,
        gender: true,
      }
    });

    res.status(200).json(users); 
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const submitUserRating = async (req: Request, res: Response) => {
  try {
    const { reviewedUserId, rating } = req.body;

    if (!reviewedUserId || rating == null) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    await prisma.review.create({
      data: {
        rating,
        reviewedUser: { connect: { id: reviewedUserId } },
      },
    });

    const allReviews = await prisma.review.findMany({
      where: { reviewedUserId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.user.update({
      where: { id: reviewedUserId },
      data: { rating: avgRating },
    });

    res.status(200).json({ message: "Rating submitted successfully." });
  } catch (err: any) {
    console.error("Error submitting rating:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};
