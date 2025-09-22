import { Request, Response } from "express";
import News from "../models/news.model";

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find({});
    res.status(200).json(news);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    res.status(200).json(news);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    const news = await News.create(req.body);
    res.status(200).json(news);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndUpdate(id, req.body);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const updatedNews = await News.findById(id);
    res.status(200).json(updatedNews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndDelete(id, req.body);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const updatedNews = await News.findById(id);
    res.status(200).json({ message: "News deleted succesfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
