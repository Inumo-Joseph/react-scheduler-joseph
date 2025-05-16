import { FC } from "react";
import { UsersIconProps } from "./types";
import AccountIcon from "./AccountIcon";

const UsersIcon: FC<UsersIconProps> = ({ users, zoom }) => {
  function getInitials(name: string) {
    const initials = name
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((n: string) => n[0])
      ?.join("")
      ?.toUpperCase();
    return initials;
  }

  if (!users || users.length === 0) return null;

  const firstUser = users[0]?.toUpperCase();
  const initials = getInitials(firstUser);
  const width = Math.min(21 * zoom, 21);
  const fontsize = Math.min(6 * zoom, 6);

  return (
    <div
      style={{
        width: width,
        height: width,
        borderRadius: "50%",
        backgroundColor: "#5243ab",
        color: "white",
        fontSize: fontsize,
        fontWeight: "bold",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textAlign: "center",
        flex: ""
      }}>
      {/* Optional faded icon behind initials */}
      <div
        style={{
          position: "absolute",
          opacity: 0.2,
          width: "90%",
          height: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <AccountIcon />
      </div>

      {/* Initials on top */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "clip",
          maxWidth: "90%",
          padding: "0"
        }}
        title={users[0]} // tooltip with full name
      >
        {firstUser}
      </span>
    </div>
  );
};

export default UsersIcon;
