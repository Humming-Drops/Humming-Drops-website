import { describe, it, expect } from "vitest";
import {
  normalizePhone,
  isValidIndianPhone,
  isValidEmail,
  isValidPincode,
  isBangalorePincode,
  sanitizeString,
  sanitizeAddress,
} from "../../src/lib/sanitization";

describe("Phone Normalization & Indian Mobile Validation", () => {
  it("normalizes clean 10-digit mobile numbers untouched", () => {
    expect(normalizePhone("9845012345")).toBe("9845012345");
    expect(normalizePhone("8618902810")).toBe("8618902810"); // Official contact
  });

  it("strips international +91 and 91 country codes", () => {
    expect(normalizePhone("+919845012345")).toBe("9845012345");
    expect(normalizePhone("+91 98450 12345")).toBe("9845012345");
    expect(normalizePhone("919845012345")).toBe("9845012345");
    expect(normalizePhone("+91-8618902810")).toBe("8618902810");
  });

  it("strips domestic trunk 0 prefix", () => {
    expect(normalizePhone("09845012345")).toBe("9845012345");
    expect(normalizePhone("0 98450 12345")).toBe("9845012345");
  });

  it("strips spaces, hyphens, and parentheses from formatted numbers", () => {
    expect(normalizePhone("+91 (98450) 123-45")).toBe("9845012345");
    expect(normalizePhone("984-501-2345")).toBe("9845012345");
    expect(normalizePhone("  98450 12345  ")).toBe("9845012345");
  });

  it("handles empty or non-string input gracefully", () => {
    expect(normalizePhone("")).toBe("");
    expect(normalizePhone(null)).toBe("");
    expect(normalizePhone(undefined)).toBe("");
    expect(normalizePhone(12345)).toBe("");
  });

  it("validates valid Indian mobile numbers starting with 6, 7, 8, 9", () => {
    expect(isValidIndianPhone("9845012345")).toBe(true);
    expect(isValidIndianPhone("8618902810")).toBe(true);
    expect(isValidIndianPhone("7012345678")).toBe(true);
    expect(isValidIndianPhone("6361234567")).toBe(true);
  });

  it("rejects invalid Indian mobile numbers", () => {
    // Numbers starting with 0 to 5
    expect(isValidIndianPhone("5123456789")).toBe(false);
    expect(isValidIndianPhone("0984501234")).toBe(false);
    expect(isValidIndianPhone("1234567890")).toBe(false);

    // Wrong length
    expect(isValidIndianPhone("984501234")).toBe(false); // 9 digits
    expect(isValidIndianPhone("98450123456")).toBe(false); // 11 digits

    // Contains non-numeric characters
    expect(isValidIndianPhone("98450abcde")).toBe(false);
    expect(isValidIndianPhone("98450-1234")).toBe(false);
    expect(isValidIndianPhone("")).toBe(false);
  });
});

describe("Email & Pincode Validation", () => {
  it("validates well-formed email addresses", () => {
    expect(isValidEmail("hummingdrops@gmail.com")).toBe(true);
    expect(isValidEmail("aarav.sharma@example.co.in")).toBe(true);
    expect(isValidEmail("dr.vikram+wellness@medcity.org")).toBe(true);
  });

  it("rejects malformed email addresses", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user @domain.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });

  it("validates 6-digit Indian postal codes", () => {
    expect(isValidPincode("560038")).toBe(true); // Indiranagar
    expect(isValidPincode("560103")).toBe(true); // Bellandur
    expect(isValidPincode("560001")).toBe(true); // Bangalore Central
    expect(isValidPincode("110001")).toBe(true); // New Delhi
  });

  it("rejects invalid Indian postal codes", () => {
    expect(isValidPincode("012345")).toBe(false); // Cannot start with 0
    expect(isValidPincode("56003")).toBe(false); // 5 digits
    expect(isValidPincode("5600388")).toBe(false); // 7 digits
    expect(isValidPincode("56003A")).toBe(false); // Non-digit
    expect(isValidPincode("")).toBe(false);
  });

  it("identifies Bangalore division postal codes (560xxx)", () => {
    expect(isBangalorePincode("560038")).toBe(true);
    expect(isBangalorePincode("560103")).toBe(true);
    expect(isBangalorePincode("560025")).toBe(true);

    // Non-Bangalore pincodes
    expect(isBangalorePincode("110001")).toBe(false); // Delhi
    expect(isBangalorePincode("400001")).toBe(false); // Mumbai
    expect(isBangalorePincode("600001")).toBe(false); // Chennai
  });
});

describe("String & Address Sanitization", () => {
  it("trims and truncates long strings to max length", () => {
    const raw = "   Fresh Morning Cut   ";
    expect(sanitizeString(raw, 10)).toBe("Fresh Morn");
    expect(sanitizeString(raw, 50)).toBe("Fresh Morning Cut");
  });

  it("strips malicious HTML markup and script tags", () => {
    const malicious = "Palm Grove <script>alert('pwned')</script> Apartments";
    const cleaned = sanitizeString(malicious, 100);
    expect(cleaned).not.toContain("<script>");
    expect(cleaned).not.toContain("</script>");
    expect(cleaned).toBe("Palm Grove alert('pwned') Apartments");
  });

  it("sanitizes complete delivery address payload", () => {
    const rawAddress = {
      flatNo: "  101-B  ",
      buildingName: "<b>Sobha Amber</b>",
      streetAddress: "Sarjapur Outer Ring Road ",
      area: " Bellandur ",
      pincode: " 560103 ",
      deliveryNotes: " Leave at front desk <script>run()</script> ",
    };

    const sanitized = sanitizeAddress(rawAddress);

    expect(sanitized.flatNo).toBe("101-B");
    expect(sanitized.buildingName).toBe("Sobha Amber");
    expect(sanitized.streetAddress).toBe("Sarjapur Outer Ring Road");
    expect(sanitized.area).toBe("Bellandur");
    expect(sanitized.city).toBe("Bangalore");
    expect(sanitized.pincode).toBe("560103");
    expect(sanitized.deliveryNotes).toBe("Leave at front desk run()");
  });
});
