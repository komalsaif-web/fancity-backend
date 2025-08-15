import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Upload File (Memory Storage - Vercel Safe)
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `uploads/${Date.now()}-${req.file.originalname}`;

    const { data, error } = await supabase.storage
      .from(process.env.BUCKET_NAME) // fancity-images
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    const publicUrl = supabase.storage
      .from(process.env.BUCKET_NAME)
      .getPublicUrl(filePath).data.publicUrl;

    res.json({
      message: 'File uploaded successfully',
      filePath,
      publicUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Signed URL
export const getSignedUrl = async (req, res) => {
  try {
    const { path: filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    const { data, error } = await supabase.storage
      .from(process.env.BUCKET_NAME)
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

    if (error) throw error;

    res.json({ signedUrl: data.signedUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
