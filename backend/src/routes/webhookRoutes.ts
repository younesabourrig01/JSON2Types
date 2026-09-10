import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { BinModel } from "../models/bin.js";
import { HttpMethod, ICapturedRequest } from "../types/webhook.js";

//create unique Bin
export const createBin = async (req: Request, res: Response): Promise<void> => {
  try {
    const binId = uuidv4().slice(0, 8);
    const newBin = await BinModel.create({
      binId,
      requests: [],
    });
    res.status(201).json({
      success: true,
      message: "Bin created successfuly",
      data: {
        binId: newBin.binId,
        endpointUrl: `${req.protocol}://${req.get("host")}/api/bins/${newBin.binId}`,
        createdAt: newBin.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Bin",
      error,
    });
  }
};
