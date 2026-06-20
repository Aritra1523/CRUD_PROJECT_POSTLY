const endPoints = {
  auth: {
    login: "/auth/login",
    verify_otp: "/auth/verify-otp",
    register: "/auth/register",

    add: "/api/post/create",
    list: "/api/post/list",
    profile: "/auth/profile",
    update: (id) => `/api/post/update/${id}`,

    forgetPassword: "/auth/reset-password-link",
    resetPassword: (userId, token) =>
      `/auth/reset-password/${userId}/${token}`,

    updatePassword: "/auth/update-password",
  },
};

export default endPoints;
