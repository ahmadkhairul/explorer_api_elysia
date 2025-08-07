import fs from "fs/promises";
import path from "path";
import { supabase } from "@/helper/supabase";

export const saveFileToSupabase = async (name: string, file: File) => {
  // save to bucket
  const { data, error } = await supabase.storage
    .from("explorer") // bucket name
    .upload("uploads/" + name, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // return path
  return data.path;
};

export const saveToLocal = async (name: string, file: File) => {
  // save to folder uploads
  const savePath = path.resolve("uploads", name);
  const buffer = await file.arrayBuffer();
  await fs.writeFile(savePath, Buffer.from(buffer));

  // return path
  return "uploads/" + name;
};

export default process.env.APP_MODE === 'development' ? saveToLocal : saveFileToSupabase
