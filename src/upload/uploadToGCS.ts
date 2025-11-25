import { Storage } from "@google-cloud/storage";
const bucketName = process.env.GCS_BUCKET!;
if (!bucketName) throw new Error("GCS_BUCKET env is required");

const storage = new Storage();
export const bucket = storage.bucket(bucketName);

export async function uploadBufferToGCS(
  buffer: Buffer,
  destinationPath: string,
  contentType = "application/octet-stream",
  _makePublic = false
) {
  const file = bucket.file(destinationPath);

  await file.save(buffer, {
    contentType,
    resumable: false,
  });

  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: "03-09-2491",
  });

  return signedUrl;
}

export async function uploadJSONToGCS(
  obj: any,
  destinationPath: string,
  makePublic = false
) {
  const buffer = Buffer.from(JSON.stringify(obj, null, 2));
  return uploadBufferToGCS(
    buffer,
    destinationPath,
    "application/json",
    makePublic
  );
}

export async function readJSONFromGCS(destinationPath: string) {
  const file = bucket.file(destinationPath);
  const [exists] = await file.exists();
  if (!exists) return null;

  const [contents] = await file.download();
  return JSON.parse(contents.toString("utf-8"));
}

export async function getPublicUrl(destinationPath: string) {
  const file = bucket.file(destinationPath);
  const [signedUrl] = await file.getSignedUrl({
    action: "read",
    expires: "03-09-2491",
  });

  return signedUrl;
}
