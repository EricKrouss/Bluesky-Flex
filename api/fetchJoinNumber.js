const fetchUserData = async () => {
    setError(""); // Clear previous error
    if (!username.trim()) {
      setError("Please enter a valid username.");
      return;
    }
  
    try {
      console.log(`Fetching profile for: ${username.trim()}`);
      const profileResponse = await axios.get(
        "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile",
        {
          params: { actor: username.trim() }, // Remove extra spaces
        }
      );
  
      const {
        displayName,
        createdAt,
        handle,
        did,
        followersCount,
        followsCount,
        postsCount,
      } = profileResponse.data;
  
      // Fetch the join number using the Vercel serverless function
      const skyZooResponse = await axios.get(
        `/api/fetchJoinNumber`,
        {
          params: { did },
        }
      );
  
      const { joinNumber } = skyZooResponse.data;
  
      // Set the user data
      setUserData({
        displayName,
        username: handle,
        joinDate: new Date(createdAt).toLocaleDateString(),
        joinNumber, // Retrieved via the proxy
        followers: followersCount,
        following: followsCount,
        posts: postsCount,
      });
  
      console.log("Fetched Profile:", profileResponse.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response) {
        console.error("API Response:", err.response.data);
        setError("Failed to fetch profile. Check the username.");
      } else {
        setError("Network error. Please try again later.");
      }
    }
  };