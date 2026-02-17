// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ============= VEHICLES API =============
export const getVehicles = async () => {
  try {
    const response = await fetch(`${API_URL}/vehicles`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
};

export const addVehicle = async (vehicle) => {
  try {
    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle)
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return { success: false, message: error.message };
  }
};

export const deleteVehicle = async (id) => {
  try {
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return { success: false, message: error.message };
  }
};

// ============= DRIVERS API =============
export const getDrivers = async () => {
  try {
    const response = await fetch(`${API_URL}/drivers`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return [];
  }
};

export const getDriverById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/drivers/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching driver:', error);
    return { success: false, message: error.message };
  }
};

export const addDriver = async (driver) => {
  try {
    const response = await fetch(`${API_URL}/drivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driver)
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding driver:', error);
    return { success: false, message: error.message };
  }
};

export const updateDriver = async (id, driver) => {
  try {
    const response = await fetch(`${API_URL}/drivers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driver)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating driver:', error);
    return { success: false, message: error.message };
  }
};

export const deleteDriver = async (id) => {
  try {
    const response = await fetch(`${API_URL}/drivers/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting driver:', error);
    return { success: false, message: error.message };
  }
};

export const searchDrivers = async (query) => {
  try {
    const response = await fetch(`${API_URL}/drivers/search/${query}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error searching drivers:', error);
    return [];
  }
};

export const getDriversByStatus = async (status) => {
  try {
    const response = await fetch(`${API_URL}/drivers/status/${status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching drivers by status:', error);
    return [];
  }
};

// ============= MEMBERS API =============
export const getMembers = async () => {
  try {
    const response = await fetch(`${API_URL}/members`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
};

export const getMemberById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/members/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching member:', error);
    return { success: false, message: error.message };
  }
};

export const addMember = async (member) => {
  try {
    const response = await fetch(`${API_URL}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding member:', error);
    return { success: false, message: error.message };
  }
};

export const updateMember = async (id, member) => {
  try {
    const response = await fetch(`${API_URL}/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating member:', error);
    return { success: false, message: error.message };
  }
};

export const deleteMember = async (id) => {
  try {
    const response = await fetch(`${API_URL}/members/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting member:', error);
    return { success: false, message: error.message };
  }
};

export const searchMembers = async (query) => {
  try {
    const response = await fetch(`${API_URL}/members/search/${query}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error searching members:', error);
    return [];
  }
};

export const getMembersByDistrict = async (district) => {
  try {
    const response = await fetch(`${API_URL}/members/district/${district}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching members by district:', error);
    return [];
  }
};

export const getMembersByStatus = async (status) => {
  try {
    const response = await fetch(`${API_URL}/members/status/${status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching members by status:', error);
    return [];
  }
};

export const getDistricts = async () => {
  try {
    const response = await fetch(`${API_URL}/members/districts/list`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};