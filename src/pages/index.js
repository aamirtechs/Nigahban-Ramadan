import { useState } from "react";
import SearchTable from "../components/SearchTable";
import InputField from "../components/InputField";
import Button from "../components/Button";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [mobileNo, setMobileNo] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Function to validate and format the mobile number
  const formatMobileNumber = (number) => {
    const cleaned = number.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    if (cleaned.length === 10 && cleaned.startsWith("3")) return cleaned; // 3027360690
    if (cleaned.length === 11 && cleaned.startsWith("03")) return cleaned.substring(1); // 03027360690 → 3027360690
    if (cleaned.length === 12 && cleaned.startsWith("923")) return cleaned.substring(2); // 923027360690 → 3027360690
    if (cleaned.length === 13 && cleaned.startsWith("+923")) return cleaned.substring(3); // +923027360690 → 3027360690
    return null; // Invalid format
  };

  const handleSearch = async () => {
    setError("");
    setData(null);
    setSuccessMessage("");
    setLoading(true);

    const formattedNumber = formatMobileNumber(mobileNo);
    if (!formattedNumber) {
      setError("❗ Please enter a valid Pakistani mobile number.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/search?mobileNo=${formattedNumber}`);
      const result = await response.json();

      if (response.ok && result.Name) {
        setData(result);
        setSuccessMessage(
          `🎉 Congratulations, ${result.Name}! You're eligible for Rs. 10,000 amount of cheque under Nigahban Ramadan Package 2025. Please wait for a call or text message from your Union Council.`
        );
      } else {
        setError("😞 Sorry! This number was not found! Please try searching using any other number.");
      }
    } catch (err) {
      setError("⚠️ Error fetching data.");
    }

    setLoading(false);
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url('/bg.svg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="row w-100 h-100 d-flex align-items-center">
        {/* Left Side - Search Component */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="w-100 text-white"
            style={{
              maxWidth: "400px",
              background: "transparent",
            }}
          >
            {/* Govt Logo */}
            <div className="text-center mb-3">
              <img src="/logo.svg" alt="Govt of Punjab" className="img-fluid" style={{ height: "70px" }} />
            </div>
            <h4 className="fw-bold text-center">Nigahban Ramadan Package 2025</h4>
            <p className="text-center">Tehsil Shujabad, District Multan</p>

            <InputField
              label="Enter Mobile Number"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              placeholder="3012345678"
            />
            <Button text="Search" onClick={handleSearch} isLoading={loading} />

            {/* Error Message */}
            {error && <p className="mt-3 text-justify fw-semibold">{error}</p>}

            {/* Success Message */}
            {successMessage && <p className="mt-3 text-justify fw-semibold">{successMessage}</p>}
          </div>
        </div>

        {/* Right Side - Background Image */}
        <div
          className="col-md-6 d-none d-md-block"
          style={{
            backgroundImage: `url('/right.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
        ></div>
      </div>

      {/* Footer */}
      <footer className="position-absolute bottom-0 w-100 text-center py-3 text-light">
        © {new Date().getFullYear()} Govt of Punjab - Tehsil Shujabad, District Multan
      </footer>
    </div>
  );
}
