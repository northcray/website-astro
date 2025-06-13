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
  { href: "/ra/history", label: "History" },
  { href: "/ra/agm", label: "Minutes" },
  { href: "/ra/archive", label: "Archive" },
  { href: loggedInPath, label: "My Account" },
];
