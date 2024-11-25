export const getInfo = async () => {
    const URL = "http://161.35.143.238:8000/efau";
    try {
      const response = await fetch(URL, {
        headers: {
          "bypass-tunnel-reminder": "true",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.log("Error getting info");
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export const getInfoById = async (id: string) => {
    const URL = `http://161.35.143.238:8000/efau/${id}`;
    try {
      const response = await fetch(URL, {
        headers: {
          "bypass-tunnel-reminder": "true",
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.log("Error getting info");
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  };

  export const addTeam = async (team: {
    name: string;
    description: string;
    goals: number;
    points: number;
    logo?: string;
  }) => {
    const URL = "http://161.35.143.238:8000/efau";
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(team),
      });
  
      if (!response.ok) {
        throw new Error("Error adding new team");
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  export const deleteTeamById = async (id: string) => {
    const URL = `http://161.35.143.238:8000/efau/${id}`;
    try {
      const response = await fetch(URL, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error deleting team");
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  export const updateTeamById = async (id: string, team: {
    name: string;
    description: string;
    goals: number;
    points: number;
    logo?: string;
  }) => {
    const URL = `http://161.35.143.238:8000/efau/${id}`;
    try {
      const response = await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(team),
      });

      if (!response.ok) {
        throw new Error("Error updating team");
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };