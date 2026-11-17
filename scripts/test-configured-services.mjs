import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";

async function testClerk() {
  console.log("\n==================================================");
  console.log("1. TESTING CLERK CONFIGURATION & CONNECTIVITY");
  console.log("==================================================");

  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const secKey = process.env.CLERK_SECRET_KEY || "";
  const whSec = process.env.CLERK_WEBHOOK_SIGNING_SECRET || "";

  console.log(`- Publishable Key: ${pubKey ? pubKey.slice(0, 12) + "..." : "MISSING"}`);
  console.log(`- Secret Key: ${secKey ? secKey.slice(0, 10) + "..." : "MISSING"}`);
  console.log(`- Webhook Secret: ${whSec}`);

  if (whSec === "whsec_placeholder") {
    console.log("  ⚠️ WARNING: CLERK_WEBHOOK_SIGNING_SECRET is still set to 'whsec_placeholder'!");
    console.log("    Real webhooks from Clerk Svix will fail verification until you set the endpoint secret from Clerk Dashboard -> Webhooks.");
  }

  if (!secKey) {
    console.log("  ❌ ERROR: CLERK_SECRET_KEY is missing.");
    return { success: false, reason: "CLERK_SECRET_KEY missing" };
  }

  try {
    const res = await fetch("https://api.clerk.com/v1/users?limit=5", {
      headers: {
        Authorization: `Bearer ${secKey}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      const users = await res.json();
      console.log(`  ✅ Clerk API Authenticated successfully! HTTP 200 OK.`);
      console.log(`  ℹ️ Total existing users in Clerk instance: ${users.length}`);
      return { success: true, userCount: users.length };
    } else {
      const err = await res.text();
      console.log(`  ❌ Clerk API returned HTTP ${res.status}: ${err}`);
      return { success: false, status: res.status, error: err };
    }
  } catch (error) {
    console.log(`  ❌ Clerk API Network Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testMongoDB() {
  console.log("\n==================================================");
  console.log("2. TESTING MONGODB CONFIGURATION & CONNECTIVITY");
  console.log("==================================================");

  const uri = process.env.MONGODB_URI || "";
  if (!uri) {
    console.log("  ❌ ERROR: MONGODB_URI is missing.");
    return { success: false, reason: "MONGODB_URI missing" };
  }

  console.log(`- URI Scheme: ${uri.split("://")[0]}`);
  const hostPart = uri.includes("@") ? uri.split("@")[1].split("/")[0] : uri;
  console.log(`- Cluster Host: ${hostPart}`);

  // 1. Test native MongoClient
  let mongoSuccess = false;
  let mongoClient;
  try {
    console.log("- Testing native MongoClient connection...");
    mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await mongoClient.connect();
    const adminDb = mongoClient.db().admin();
    const pingResult = await adminDb.ping();
    console.log("  ✅ Native MongoClient ping succeeded:", pingResult);
    mongoSuccess = true;
  } catch (err) {
    console.log("  ❌ Native MongoClient connection failed:", err.message);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }

  // 2. Test Mongoose connection & Lead Model CRUD
  let mongooseSuccess = false;
  try {
    console.log("- Testing Mongoose connection & Model CRUD...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log("  ✅ Mongoose connected successfully. State:", mongoose.connection.readyState);

    const LeadSchema = new mongoose.Schema({
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      planId: { type: String, required: true },
      status: { type: String, default: "pending_confirmation" },
      createdAt: { type: Date, default: Date.now },
    });

    const TestLead = mongoose.models.TestLead || mongoose.model("TestLead", LeadSchema);

    // Create test lead
    const testDoc = await TestLead.create({
      fullName: "Diagnostic Automated Test",
      email: `test-${Date.now()}@hummingdrops-test.com`,
      phone: "9876543210",
      planId: "standard",
    });
    console.log("  ✅ Test document inserted. ID:", testDoc._id.toString());

    // Query test lead
    const foundDoc = await TestLead.findById(testDoc._id);
    if (!foundDoc) {
      throw new Error("Could not find inserted test document.");
    }
    console.log("  ✅ Test document retrieved:", foundDoc.fullName, "| status:", foundDoc.status);

    // Delete test lead (cleanup)
    await TestLead.deleteOne({ _id: testDoc._id });
    console.log("  ✅ Test document deleted (Cleaned up).");

    mongooseSuccess = true;
  } catch (err) {
    console.log("  ❌ Mongoose test failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }

  return { success: mongoSuccess && mongooseSuccess };
}

async function testCloudinary() {
  console.log("\n==================================================");
  console.log("3. TESTING CLOUDINARY (CLOUD STORAGE) CONNECTIVITY");
  console.log("==================================================");

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log(`- Cloud Name: ${cloudName || "MISSING"}`);
  console.log(`- API Key: ${apiKey ? apiKey.slice(0, 4) + "..." + apiKey.slice(-4) : "MISSING"}`);
  console.log(`- API Secret: ${apiSecret ? apiSecret.slice(0, 4) + "..." : "MISSING"}`);

  if (!cloudName || !apiKey || !apiSecret) {
    console.log("  ❌ ERROR: Incomplete Cloudinary credentials.");
    return { success: false, reason: "Credentials missing" };
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    console.log("- Testing Cloudinary API ping...");
    let pingRes;
    try {
      pingRes = await cloudinary.api.ping();
    } catch (certErr) {
      if (certErr.message?.includes("certificate") || certErr.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE") {
        console.log("  ⚠️ Local Network Warning: Local network has an SSL-inspecting proxy/firewall (Sophos).");
        console.log("    Retrying diagnostic check with local TLS workaround for developer network...");
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        pingRes = await cloudinary.api.ping();
      } else {
        throw certErr;
      }
    }
    console.log("  ✅ Cloudinary API Ping successful:", pingRes);

    console.log("- Testing Cloudinary Upload of test buffer...");
    // 1x1 transparent PNG in base64
    const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const testBuffer = Buffer.from(base64Png, "base64");

    const uploadRes = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "humming_drops_diagnostic_tests",
          public_id: `test_${Date.now()}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) reject(error || new Error("No result returned"));
          else resolve(result);
        }
      );
      uploadStream.end(testBuffer);
    });

    console.log("  ✅ Cloudinary Upload successful!");
    console.log("  - Secure URL:", uploadRes.secure_url);
    console.log("  - Public ID:", uploadRes.public_id);
    console.log("  - Bytes:", uploadRes.bytes);
    console.log("  - Format:", uploadRes.format);

    console.log("- Cleaning up test asset from Cloudinary...");
    const destroyRes = await cloudinary.uploader.destroy(uploadRes.public_id);
    console.log("  ✅ Cloudinary Cleanup successful:", destroyRes.result);

    return { success: true, url: uploadRes.secure_url };
  } catch (err) {
    console.log("  ❌ Cloudinary test failed:", err.message);
    return { success: false, error: err.message };
  }
}

async function runAll() {
  console.log("==================================================");
  console.log("HUMMING DROPS INTEGRATION TEST SUITE");
  console.log("Testing Clerk, MongoDB, and Cloudinary");
  console.log("==================================================");

  const clerkResult = await testClerk();
  const mongoResult = await testMongoDB();
  const cloudResult = await testCloudinary();

  console.log("\n==================================================");
  console.log("TEST SUMMARY");
  console.log("==================================================");
  console.log(`Clerk Authentication:   ${clerkResult.success ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`MongoDB Database:       ${mongoResult.success ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`Cloudinary Storage:     ${cloudResult.success ? "✅ PASSED" : "❌ FAILED"}`);
  console.log("==================================================");

  if (clerkResult.success && mongoResult.success && cloudResult.success) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAll().catch((e) => {
  console.error("Fatal Test Suite Error:", e);
  process.exit(1);
});
