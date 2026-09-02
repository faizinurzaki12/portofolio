/* ==========================================================================
   STORE.JS - SUPABASE DATABASE INTEGRATION
   ========================================================================== */

const SUPABASE_URL = "https://gpctgwtvxdyhykgoiskh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SzLkOXbBKq2Y10aPCxKtuw_1W_UIb9M";

// Inisialisasi Client Supabase
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fungsi pembantu HANYA untuk error fatal (fetching data awal aplikasi/dashboard gagal)
function trigger500Error(error) {
  console.error("Fatal Database Fetch Error:", error);
  if (!window.location.pathname.endsWith("500.html")) {
    const redirectPath = window.location.pathname.includes("/admin/") ? "../500.html" : "500.html";
    window.location.href = redirectPath;
  }
}

const Store = {
  // ------------------------------------------------------------------------
  // AUTH & GUARD MANAGEMENT
  // ------------------------------------------------------------------------

  async login(username, password) {
    try {
      const { data, error } = await _supabase.from("admins").select("*").eq("username", username).eq("password", password).maybeSingle();

      if (error) throw error;

      if (data) {
        sessionStorage.setItem(
          "admin_session",
          JSON.stringify({
            id: data.id,
            username: data.username,
            name: data.name,
            role: data.role,
            avatar: data.avatar,
          }),
        );
        return { success: true, user: data };
      } else {
        return { success: false, message: "Username atau password salah!" };
      }
    } catch (err) {
      console.error("Login Error:", err);
      return { success: false, message: err.message };
    }
  },

  isLoggedIn() {
    return sessionStorage.getItem("admin_session") !== null;
  },

  getAdminSession() {
    const session = sessionStorage.getItem("admin_session");
    return session ? JSON.parse(session) : null;
  },

  getCurrentUser() {
    return this.getAdminSession();
  },

  logout() {
    sessionStorage.removeItem("admin_session");
    window.location.href = "../login.html";
  },

  checkAdminAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = "../login.html";
    }
  },

  // ------------------------------------------------------------------------
  // ADMINS MANAGEMENT
  // ------------------------------------------------------------------------

  async getAdmins() {
    try {
      const { data, error } = await _supabase.from("admins").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      trigger500Error(err);
      return [];
    }
  },

  async addAdmin(adminData) {
    try {
      const { data, error } = await _supabase.from("admins").insert([adminData]).select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Add Admin Error:", err);
      return { data: null, error: err };
    }
  },

  async updateAdmin(id, updateData) {
    try {
      updateData.updated_at = new Date();
      const { data, error } = await _supabase.from("admins").update(updateData).eq("id", id).select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Update Admin Error:", err);
      return { data: null, error: err };
    }
  },

  async deleteAdmin(id) {
    try {
      const { error } = await _supabase.from("admins").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Delete Admin Error:", err);
      return false;
    }
  },

  // ------------------------------------------------------------------------
  // PROJECTS MANAGEMENT
  // ------------------------------------------------------------------------

  async getProjects() {
    try {
      const { data, error } = await _supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      trigger500Error(err);
      return [];
    }
  },

  async getProjectById(id) {
    try {
      const { data, error } = await _supabase.from("projects").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    } catch (err) {
      trigger500Error(err);
      return null;
    }
  },

  async addProject(projectData) {
    try {
      // Konversi string pisahan koma ke Array untuk technologies dan tags
      if (typeof projectData.technologies === "string") {
        projectData.technologies = projectData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      if (typeof projectData.tags === "string") {
        projectData.tags = projectData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      // Default category jika kosong
      if (!projectData.category) {
        projectData.category = "General";
      }

      const { data, error } = await _supabase.from("projects").insert([projectData]).select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Add Project Error:", err);
      return { data: null, error: err };
    }
  },

  async updateProject(id, updateData) {
    try {
      updateData.updated_at = new Date();

      if (typeof updateData.technologies === "string") {
        updateData.technologies = updateData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      if (typeof updateData.tags === "string") {
        updateData.tags = updateData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      const { data, error } = await _supabase.from("projects").update(updateData).eq("id", id).select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Update Project Error:", err);
      return { data: null, error: err };
    }
  },

  async deleteProject(id) {
    try {
      const { error } = await _supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Delete Project Error:", err);
      return false;
    }
  },

  // ------------------------------------------------------------------------
  // MESSAGES MANAGEMENT
  // ------------------------------------------------------------------------

  async getMessages() {
    try {
      const { data, error } = await _supabase.from("messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      trigger500Error(err);
      return [];
    }
  },

  async addMessage(messageData) {
    try {
      const { data, error } = await _supabase.from("messages").insert([messageData]).select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Add Message Error:", err);
      return { data: null, error: err };
    }
  },

  async sendMessage(messageData) {
    return this.addMessage(messageData);
  },

  async markMessageAsRead(id) {
    try {
      const { data, error } = await _supabase.from("messages").update({ read: true }).eq("id", id).select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Mark Read Error:", err);
      return { data: null, error: err };
    }
  },

  async deleteMessage(id) {
    try {
      const { error } = await _supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Delete Message Error:", err);
      return false;
    }
  },

  // ------------------------------------------------------------------------
  // PROFILE MANAGEMENT
  // ------------------------------------------------------------------------

  async getProfile() {
    try {
      const { data, error } = await _supabase.from("profile").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data || {};
    } catch (err) {
      console.error("Get Profile Error:", err);
      return {};
    }
  },

  async updateProfile(profileData) {
    try {
      profileData.updated_at = new Date();

      // Format input skills pisahan koma menjadi Array Postgre
      if (typeof profileData.skills === "string") {
        profileData.skills = profileData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const { data, error } = await _supabase.from("profile").update(profileData).eq("id", 1).select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error("Update Profile Error:", err);
      return { data: null, error: err };
    }
  },
};
