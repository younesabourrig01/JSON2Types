import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { BinModel } from "../models/bin.js";
import { HttpMethod, ICapturedRequest } from "../types/webhook.js";
import { generateTypeScriptInterfaces } from "../tools/jsonToTs.js";

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

// catch bin
export const captureWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { bindId } = req.params;
    const bin = await BinModel.findOne({ bindId });
    if (!bin) {
      res.status(404).json({
        success: false,
        message: "Bin not found",
      });
    }

    const capturedReq: ICapturedRequest = {
      requestId: uuidv4(),
      method: req.method as HttpMethod,
      headers: req.headers,
      body: req.body || {},
      queryParams: req.query || {},
      ip: req.ip || req.socket.remoteAddress || "Unknown",
      timestamp: new Date(),
    };

    bin?.requests.unshift(capturedReq);
    await bin?.save();

    res.status(200).json({
      success: true,
      message: "Webhook captured successfully",
      requestId: capturedReq.requestId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to capture webhook", error });
  }
};

//get all requests for each Bind
export const getBinRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { bindId } = req.params;
    const bin = await BinModel.findOne({ bindId });

    if (!bin) {
      res.status(404).json({ success: false, message: "Bin not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        binId: bin.binId,
        totalRequests: bin.requests.length,
        requests: bin.requests,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to capture webhook", error });
  }
};

//delete bin
export const deleteBin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { binId } = req.params;

    if (!binId) {
      res.status(404).json({ success: false, message: "binId is required" });
      return;
    }

    const deleted = await BinModel.findOneAndDelete({ binId });

    if (!deleted) {
      res.status(404).json({ success: false, message: "Bin not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Bin deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete bin", error });
  }
};

//generate TypeScript Interface
export const getRequestTypes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { binId, requestId } = req.params;
    if (!binId || !requestId) {
      res.status(404).json({
        sucsess: false,
        message: "binId / requestId required",
      });
      return;
    }

    const bin = await BinModel.findOne({ binId });

    if (!bin) {
      res.status(404).json({ success: false, message: "Bin not found" });
      return;
    }

    const requestItem = bin.requests.find((r) => r.requestId === requestId);
    if (!requestItem) {
      res.status(404).json({ success: false, message: "Request not found" });
      return;
    }

    const tsTypes = generateTypeScriptInterfaces(requestItem.body, "Payload");

    res.status(200).json({
      success: true,
      data: {
        requestId: requestItem.requestId,
        typescriptTypes: tsTypes,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to generate TS types", error });
  }
};
