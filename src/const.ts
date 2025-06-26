export const loggedInPath = "/ra/me";

export const robotsDisallowPaths = [
  `${loggedInPath}/`,
  "/account/",
  "/return/",
  "/redirect/portal/",
  "/logout/",
];

export const tabsAssociation = [
  { href: "/ra/about", label: "About" },
  { href: "/ra/archive", label: "Archive" },
  { href: loggedInPath, label: "My Account" },
];

export const officerRoles = [
  "Chairman",
  "Honorary Secretary",
  "Honorary Treasurer",
  "Digital Services",
];

enum Role {
  ADMIN = "admin",
  COMMITTEE = "committee",
  USER = "user",
}

export const roles = {
  [Role.ADMIN]: "b451d9f6-a3bb-4d03-b590-376d948ec1a0",
  [Role.COMMITTEE]: "3d3d7605-9852-4c61-8b44-0b890b08a18a",
  [Role.USER]: "98cfe67a-3829-48dc-a956-68b95e5eb181",
};

const isRole = (role: Role) => (id: string) => id === roles[role];

export const isAdmin = isRole(Role.ADMIN);
export const isCommittee = isRole(Role.COMMITTEE);
export const isUser = isRole(Role.USER);
