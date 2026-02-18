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