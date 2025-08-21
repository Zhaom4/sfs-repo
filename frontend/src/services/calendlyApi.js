// Get team members - requires admin access
export const getTeamMembers = async () => {
  const response = await fetch('https://api.calendly.com/users', {
    headers: {
      'Authorization': `Bearer ${CALENDLY_ACCESS_TOKEN}`
    }
  });
  
  const data = await response.json();
  return data.collection; // Array of team members
};

// Get individual user's event types
export const getUserEventTypes = async (userUri) => {
  const response = await fetch(`https://api.calendly.com/event_types?user=${userUri}`, {
    headers: {
      'Authorization': `Bearer ${CALENDLY_ACCESS_TOKEN}`
    }
  });
  
  return response.json();
};