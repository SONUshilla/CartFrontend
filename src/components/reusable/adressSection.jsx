import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";
import axios from "axios";
import { address } from "framer-motion/client";

const baseUrl = process.env.REACT_APP_BASEURL;

const AddressSection = ({ setAddress, darkMode }) => {
  // State management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [viewMode, setViewMode] = useState("compact"); // 'compact', 'manage', or 'form'
  const [newAddress, setNewAddress] = useState({
    id: "",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    mobile: "",
    isDefault: false,
  });

  // Initial address structure
  const initialAddressState = {
    id: "",
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    mobile: "",
    isDefault: false,
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${baseUrl}/getAddresses`);
      if (Array.isArray(res.data)) {
        setAddresses(res.data);
        localStorage.setItem("addresses", JSON.stringify(res.data));
        const defaultAddr =
          res.data.find((a) => a.isDefault) || res.data[0] || null;
        setSelectedAddress(defaultAddr);
        if (defaultAddr) setAddress(defaultAddr);
      }
    } catch (err) {
      console.error(
        "Failed to fetch addresses, loading from localStorage",
        err
      );
      const saved = JSON.parse(localStorage.getItem("addresses") || "[]");
      setAddresses(saved);
      const defaultAddr = saved.find((a) => a.isDefault) || saved[0] || null;
      setSelectedAddress(defaultAddr);
      if (defaultAddr) setAddress(defaultAddr);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [setAddress]);

  const isEmptyAddress = (addr) => {
    if (!addr) return true;
    return (
      !addr.fullName &&
      !addr.addressLine1 &&
      !addr.city &&
      !addr.state &&
      !addr.zip
    );
  };

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
    if (selectedAddress && !isEmptyAddress(selectedAddress)) {
      setAddress(selectedAddress);
    } else {
      setAddress(null);
    }
  }, [addresses, selectedAddress, setAddress]);

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveAddress = async (e) => {
    e.preventDefault();

    try {
      if (newAddress.id) {
        await axios.post(`${baseUrl}/updateAddress`, { address: newAddress });
      } else {
        await axios.post(`${baseUrl}/addAddress`, { newAddress });
      }

      fetchAddresses();
      setNewAddress(initialAddressState);
      setViewMode("compact");
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  const setAsDefault = async (id) => {
    try {
      await axios.post(`${baseUrl}/setDefaultAddress`, { id });
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      setAddresses(updatedAddresses);

      const newDefault = updatedAddresses.find((addr) => addr.id === id);
      setSelectedAddress(newDefault);
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await axios.post(`${baseUrl}/deleteAddress`, { id: id });
      const updatedAddresses = addresses.filter((addr) => addr.id !== id);
      setAddresses(updatedAddresses);

      if (selectedAddress?.id === id) {
        const newSelected =
          updatedAddresses.length > 0 ? updatedAddresses[0] : null;
        setSelectedAddress(newSelected);
      }
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const editAddress = (address) => {
    setNewAddress(address);
    setViewMode("form");
  };

  // Styling variables based on dark mode
  const bgColor = darkMode ? "bg-gray-700" : "bg-white";
  const borderColor = darkMode ? "border-gray-600" : "border-gray-200";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-500";
  const inputBg = darkMode ? "bg-gray-600" : "bg-white";
  const inputBorder = darkMode ? "border-gray-500" : "border-gray-300";
  const inputText = darkMode ? "text-white" : "text-gray-900";

  // New button styles
  const primaryButtonStyle =
    "relative border-2 border-black overflow-hidden px-6 py-3 text-black hover:text-white font-bold uppercase text-sm tracking-wide flex items-center group transition-all duration-300";
  const secondaryButtonStyle =
    "border-2 border-black px-6 py-3 text-black font-bold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-colors duration-300";

  return (
    <div className="p-6">
      {viewMode === "form" ? (
        <form onSubmit={saveAddress} className="space-y-6">
          <h2
            className={`text-xl font-extrabold uppercase tracking-tight ${textColor}`}
          >
            {newAddress.id ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries({
              fullName: "Full Name",
              addressLine1: "Address Line 1",
              addressLine2: "Address Line 2",
              city: "City",
              state: "State",
              zip: "ZIP Code",
              mobile: "Mobile Number",
            }).map(([key, label]) => (
              <div
                key={key}
                className={key.startsWith("addressLine") ? "md:col-span-2" : ""}
              >
                <label
                  className={`block text-sm font-semibold uppercase tracking-wide mb-2 ${textMuted}`}
                >
                  {label}
                </label>
                <input
                  type="text"
                  name={key}
                  value={newAddress[key]}
                  onChange={handleAddressChange}
                  className={`w-full px-4 py-3 rounded-sm border-2 text-sm font-bold uppercase ${inputBg} ${inputBorder} ${inputText}`}
                  placeholder={`ENTER ${label.toUpperCase()}`}
                  required={key !== "addressLine2"}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center mt-4">
            <input
              name="isDefault"
              type="checkbox"
              checked={newAddress.isDefault}
              onChange={(e) =>
                setNewAddress({ ...newAddress, isDefault: e.target.checked })
              }
              className={`h-5 w-5 rounded-sm ${
                darkMode
                  ? "text-black bg-gray-600 border-gray-500"
                  : "text-black border-gray-300"
              }`}
              id="defaultAddress"
            />
            <label
              htmlFor="defaultAddress"
              className={`ml-3 text-sm font-semibold uppercase tracking-wide ${textColor}`}
            >
              Set as default shipping address
            </label>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => {
                setNewAddress(initialAddressState);
                setViewMode(addresses.length > 0 ? "manage" : "compact");
              }}
              className={secondaryButtonStyle}
            >
              Cancel
            </button>
            <button type="submit" className={primaryButtonStyle}>
              <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0" />
              <span className="relative z-10 flex items-center">
                Save Address <FiArrowRight className="ml-2" />
              </span>
            </button>
          </div>
        </form>
      ) : viewMode === "manage" ? (
        <div className="space-y-6">
          <h2
            className={`text-xl font-extrabold uppercase tracking-tight ${textColor}`}
          >
            SELECT ADDRESS
          </h2>

          <div className="space-y-4  overflow-y-auto pr-2">
            {addresses.length === 0 ? (
              <div
                className={`text-center py-8 rounded-sm ${bgColor} border-2 ${borderColor}`}
              >
                <FiMapPin className={`w-12 h-12 mx-auto ${textMuted}`} />
                <p
                  className={`mt-4 text-sm font-semibold uppercase tracking-wide ${textColor}`}
                >
                  No saved addresses
                </p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className={`rounded-sm p-4 border-2 ${
                    selectedAddress?.id === address.id
                      ? "border-black"
                      : borderColor
                  } ${bgColor}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className={`font-bold uppercase tracking-wide ${textColor}`}
                      >
                        {address.fullName}
                      </p>
                      <p
                        className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textColor}`}
                      >
                        {address.addressLine1}
                      </p>
                      {address.addressLine2 && (
                        <p
                          className={`text-sm font-semibold uppercase tracking-wide ${textColor}`}
                        >
                          {address.addressLine2}
                        </p>
                      )}
                      <p
                        className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textMuted}`}
                      >
                        {address.city}, {address.state} {address.zip}
                      </p>
                      {address.mobile && (
                        <p
                          className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textMuted}`}
                        >
                          Mobile: {address.mobile}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editAddress(address)}
                          className={`p-2 rounded-sm ${
                            darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                          }`}
                          aria-label="Edit address"
                        >
                          <FiEdit2
                            className={`${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => deleteAddress(address.id)}
                          className={`p-2 rounded-sm ${
                            darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                          }`}
                          aria-label="Delete address"
                        >
                          <FiTrash2
                            className={`${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedAddress(address);
                        setViewMode("compact");
                      }}
                      className={`relative border-2 border-black overflow-hidden px-4 py-2 text-sm font-bold uppercase tracking-wide flex items-center group transition-all duration-300
    ${
      selectedAddress?.id === address.id
        ? "bg-black text-white"
        : "text-black hover:text-white"
    }`}
                    >
                      {/* Animated background for hover (only if not selected) */}
                      {selectedAddress?.id !== address.id && (
                        <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0" />
                      )}
                      <span className="relative z-10 flex items-center">
                        {selectedAddress?.id === address.id ? (
                          <>
                            Selected <FiCheck className="ml-2" />
                          </>
                        ) : (
                          "Select"
                        )}
                      </span>
                    </button>

                    <button
                      onClick={() => setAsDefault(address.id)}
                      className={`relative border-2 border-black overflow-hidden px-4 py-2 text-sm font-bold uppercase tracking-wide flex items-center group transition-all duration-300 ${
                        address.isDefault
                          ? "bg-black text-white"
                          : "text-black hover:text-white"
                      }`}
                    >
                      {/* Animated background for hover (only if not default) */}
                      {!address.isDefault && (
                        <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0" />
                      )}
                      <span className="relative z-10">
                        {address.isDefault ? "✓ Default" : "Set Default"}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setViewMode("compact")}
              className={secondaryButtonStyle}
            >
              Back
            </button>
            <button
              onClick={() => {
                setNewAddress(initialAddressState);
                setViewMode("form");
              }}
              className={primaryButtonStyle}
            >
              <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0" />
              <span className="relative z-10 flex items-center">
                Add New Address <FiArrowRight className="ml-2" />
              </span>
            </button>
          </div>
        </div>
      ) : selectedAddress ? (
        <div className={`rounded-sm p-6 border-2 ${borderColor} ${bgColor}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2
                className={`text-xl font-extrabold uppercase tracking-tight ${textColor} mb-4`}
              >
                Shipping Address
              </h2>
              <p className={`font-bold uppercase tracking-wide ${textColor}`}>
                {selectedAddress.fullName}
              </p>
              <p
                className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textColor}`}
              >
                {selectedAddress.addressLine1}
              </p>
              {selectedAddress.addressLine2 && (
                <p
                  className={`text-sm font-semibold uppercase tracking-wide ${textColor}`}
                >
                  {selectedAddress.addressLine2}
                </p>
              )}
              <p
                className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textMuted}`}
              >
                {selectedAddress.city}, {selectedAddress.state}{" "}
                {selectedAddress.zip}
              </p>
              {selectedAddress.mobile && (
                <p
                  className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textMuted}`}
                >
                  Mobile: {selectedAddress.mobile}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end">
              {selectedAddress.isDefault && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-bold uppercase bg-black text-white mb-2">
                  Default
                </span>
              )}
              <button
                onClick={() => setViewMode("manage")}
                className={secondaryButtonStyle}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`text-center py-8 rounded-sm border-2 ${borderColor} ${bgColor}`}
        >
          <FiMapPin className={`w-12 h-12 mx-auto ${textMuted}`} />
          <h3
            className={`mt-4 text-lg font-extrabold uppercase tracking-tight ${textColor}`}
          >
            No shipping address
          </h3>
          <p
            className={`mt-2 text-sm font-semibold uppercase tracking-wide ${textMuted}`}
          >
            Add an address to continue with checkout
          </p>
          <button
            onClick={() => {
              setNewAddress(initialAddressState);
              setViewMode("form");
            }}
            className={`mt-6 ${primaryButtonStyle}`}
          >
            <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0" />
            <span className="relative z-10 flex items-center">
              Add Address <FiArrowRight className="ml-2" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
