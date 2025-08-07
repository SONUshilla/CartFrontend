import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiMapPin } from 'react-icons/fi';

const AddressSection = ({ setAddress, darkMode }) => {
  // State management
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newAddress, setNewAddress] = useState({
    id: '',
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zip: '',
    mobile: '',
    isDefault: false
  });

  // Load addresses from localStorage on component mount
  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    setAddresses(savedAddresses);
    
    const defaultAddress = savedAddresses.find(addr => addr.isDefault);
    setSelectedAddress(defaultAddress || (savedAddresses.length > 0 ? savedAddresses[0] : null));
  }, []);
  const isEmptyAddress = (addr) => {
    if (!addr) return true;
    return !addr.fullName && !addr.addressLine1 && !addr.city && !addr.state && !addr.zip;
  };
  
  // Save addresses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
    if (selectedAddress && !isEmptyAddress(selectedAddress)) {
      setAddress(selectedAddress);
      console.log(selectedAddress);
    }
  }, [addresses, selectedAddress, setAddress]);

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveAddress = (e) => {
    e.preventDefault();
    
    // Create new address object
    const address = {
      ...newAddress,
      id: newAddress.id || Date.now().toString()
    };

    // Update addresses list
    let updatedAddresses;
    if (address.isDefault) {
      // Reset all other default addresses
      updatedAddresses = addresses.map(a => ({...a, isDefault: false}));
    } else {
      updatedAddresses = [...addresses];
    }

    // Add/update the address
    const existingIndex = addresses.findIndex(a => a.id === address.id);
    if (existingIndex >= 0) {
      updatedAddresses[existingIndex] = address;
    } else {
      updatedAddresses.push(address);
    }

    // Update state and storage
    setAddresses(updatedAddresses);
    setSelectedAddress(address);
    setShowAddressForm(false);
    setEditMode(false);
    setNewAddress({
      id: '',
      fullName: '',
      addressLine1: '',
      city: '',
      state: '',
      zip: '',
      mobile: '',
      isDefault: false
    });
  };

  const setAsDefault = (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedAddresses);
    
    const newDefault = updatedAddresses.find(addr => addr.id === id);
    setSelectedAddress(newDefault);
  };

  const deleteAddress = (id) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    
    
    if (selectedAddress?.id === id) {
      setSelectedAddress(updatedAddresses.length > 0 ? updatedAddresses[0] : null);
      setAddress(updatedAddresses.length > 0 ? updatedAddresses[0] : null);
    }
  };

  const editAddress = (address) => {
    setNewAddress(address);
    setShowAddressForm(true);
    setEditMode(true);
  };

  // Styling variables based on dark mode
  const bgColor = darkMode ? 'bg-gray-700' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-600' : 'border-gray-200';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-gray-600' : 'bg-white';
  const inputBorder = darkMode ? 'border-gray-500' : 'border-gray-300';
  const inputText = darkMode ? 'text-white' : 'text-gray-900';
  const buttonStyle = "bg-black text-white px-4 py-3 rounded-md font-bold uppercase text-sm tracking-wide hover:bg-pink-600 hover:shadow-lg transition-all";
  const secondaryButtonStyle = `${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'} px-4 py-3 rounded-md font-bold uppercase text-sm tracking-wide hover:opacity-90`;

  return (
    <div className="p-6">
      {showAddressForm ? (
        <form onSubmit={saveAddress} className="space-y-6">
          <h2 className={`text-xl font-extrabold uppercase tracking-tight ${textColor}`}>
            {editMode ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries({
              fullName: "Full Name",
              addressLine1: "Address Line 1",
              city: "City",
              state: "State",
              zip: "ZIP Code",
              mobile: "Mobile Number",
            }).map(([key, label]) => (
              <div 
                key={key} 
                className={key === "addressLine1" || key === "addressLine2" ? "md:col-span-2" : ""}
              >
                <label className={`block text-sm font-semibold uppercase tracking-wide mb-2 ${textMuted}`}>
                  {label}
                </label>
                <input
                  type="text"
                  name={key}
                  value={newAddress[key]}
                  onChange={handleAddressChange}
                  className={`w-full px-4 py-3 rounded-md border text-sm font-bold uppercase ${inputBg} ${inputBorder} ${inputText}`}
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
              onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
              className={`h-5 w-5 rounded ${darkMode ? 'text-pink-500 bg-gray-600 border-gray-500' : 'text-pink-500 border-gray-300'}`}
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
                setShowAddressForm(false);
                setNewAddress({
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
              }}
              className={secondaryButtonStyle}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={buttonStyle}
            >
              Save Address
            </button>
          </div>
        </form>
      ) : editMode ? (
        <div className="space-y-6">
          <h2 className={`text-xl font-extrabold uppercase tracking-tight ${textColor}`}>
            SELECT ADDRESS
          </h2>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {addresses.length === 0 ? (
              <div className={`text-center py-8 rounded-md ${bgColor} ${borderColor} border`}>
                <FiMapPin className={`w-12 h-12 mx-auto ${textMuted}`} />
                <p className={`mt-4 text-sm font-semibold uppercase tracking-wide ${textColor}`}>
                  No saved addresses
                </p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className={`rounded-md p-4 border ${
                    selectedAddress?.id === address.id
                      ? "border-black"
                      : borderColor
                  } ${bgColor}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-bold uppercase tracking-wide ${textColor}`}>
                        {address.fullName}
                      </p>
                      <p className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textColor}`}>
                        {address.addressLine1}
                      </p>
                      {address.addressLine2 && (
                        <p className={`text-sm font-semibold uppercase tracking-wide ${textColor}`}>
                          {address.addressLine2}
                        </p>
                      )}
                      <p className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textMuted}`}>
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p className={`text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
                        {address.country}
                      </p>
                      {address.mobile && (
                        <p className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textMuted}`}>
                          Mobile: {address.mobile}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end">
                 
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editAddress(address)}
                          className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                          aria-label="Edit address"
                        >
                          <FiEdit2 className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                        </button>
                        <button
                          onClick={() => deleteAddress(address.id)}
                          className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                          aria-label="Delete address"
                        >
                          <FiTrash2 className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedAddress(address);
                        setEditMode(false);
                      }}
                      className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide ${
                        selectedAddress?.id === address.id 
                          ? 'bg-pink-600 text-white' 
                          : darkMode 
                            ? 'bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {selectedAddress?.id === address.id ? (
                        <span className="flex items-center">
                          Selected <FiCheck className="ml-2" />
                        </span>
                      ) : "Select"}
                    </button>
                    <button
                      onClick={() => setAsDefault(address.id)}
                      className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide ${
                        address.isDefault 
                          ? 'bg-black text-white' 
                          : darkMode 
                            ? 'bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {address.isDefault ? "✓ Default" : "Set Default"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setEditMode(false)}
              className={secondaryButtonStyle}
            >
              Back
            </button>
            <button
              onClick={() => {
                setNewAddress({
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
                setShowAddressForm(true);
              }}
              className={buttonStyle}
            >
              Add New Address
            </button>
          </div>
        </div>
      ) : selectedAddress ? (
        <div className={`rounded-md p-6 border ${borderColor} ${bgColor}`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className={`text-xl font-extrabold uppercase tracking-tight ${textColor} mb-4`}>
                Shipping Address
              </h2>
              <p className={`font-bold uppercase tracking-wide ${textColor}`}>
                {selectedAddress.fullName}
              </p>
              <p className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textColor}`}>
                {selectedAddress.addressLine1}
              </p>
              {selectedAddress.addressLine2 && (
                <p className={`text-sm font-semibold uppercase tracking-wide ${textColor}`}>
                  {selectedAddress.addressLine2}
                </p>
              )}
              <p className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textMuted}`}>
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
              </p>
              <p className={`text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
                {selectedAddress.country}
              </p>
              {selectedAddress.mobile && (
                <p className={`text-sm font-semibold uppercase tracking-wide mt-1 ${textMuted}`}>
                  Mobile: {selectedAddress.mobile}
                </p>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              {selectedAddress.isDefault && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase bg-black text-white mb-2">
                  Default
                </span>
              )}
              <button
                onClick={() => setEditMode(true)}
                className={`px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide ${
                  darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`text-center py-8 rounded-md ${bgColor} ${borderColor} border`}>
          <FiMapPin className={`w-12 h-12 mx-auto ${textMuted}`} />
          <h3 className={`mt-4 text-lg font-extrabold uppercase tracking-tight ${textColor}`}>
            No shipping address
          </h3>
          <p className={`mt-2 text-sm font-semibold uppercase tracking-wide ${textMuted}`}>
            Add an address to continue with checkout
          </p>
          <button
            onClick={() => setEditMode(true)}
            className={`mt-6 ${buttonStyle}`}
          >
            Add Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressSection;