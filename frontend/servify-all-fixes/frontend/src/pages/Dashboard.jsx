import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSelfUser, getAllUsers, getAllSkills } from "../api/users";
import { formatDate } from "../utils/helpers";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userCount, setUC] = useState("—");
  const [skillCount, setSC] = useState("—");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getSelfUser(), getAllUsers(), getAllSkills()]).then(
      ([p, u, s]) => {
        if (p.status === "fulfilled") setProfile(p.value.data?.message);
        if (u.status === "fulfilled")
          setUC((u.value.data?.message || []).length);
        if (s.status === "fulfilled") {
          const count = (s.value.data?.message || []).length;
          setSC(count);
          console.log(skillCount);
        }
        setLoading(false);
      },
    );
  }, []);

  const role = (profile?.role || user?.role || "").replace("ROLE_", "");

  const QUICK = [
    {
      to: "/map",
      icon: "◎",
      label: "Find Staff",
      desc: "Locate available staff near you on the map",
    },
    {
      to: "/chat",
      icon: "◈",
      label: "Messages",
      desc: "Chat with users and staff in real-time",
    },
    {
      to: "/chatbot",
      icon: "✦",
      label: "AI Assistant",
      desc: "Get help from our AI-powered chatbot",
    },
    {
      to: "/skills",
      icon: "◇",
      label: "Browse Skills",
      desc: "Explore all available service categories",
    },
  ];
  console.log(skillCount);
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            Good {getTimeOfDay()}, {profile?.username || user?.username} 👋
          </h1>
          <p className={styles.sub}>
            Here's what's happening on Servify today.
          </p>
        </div>
        <div className={styles.roleBadge}>{role}</div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <StatCard
          icon="👥"
          label="Total Users"
          value={loading ? "…" : userCount}
          accent
        />
        <StatCard
          icon="⚡"
          label="Skill Types"
          value={loading ? "…" : skillCount}
        />
        <StatCard
          icon="📅"
          label="Member Since"
          value={formatDate(profile?.dateOfBirth)}
        />
        <StatCard
          icon="✓"
          label="Status"
          value={
            role === "STAFF"
              ? profile?.staffValidated
                ? "Validated"
                : "Pending"
              : "Active"
          }
          green={role !== "STAFF" || profile?.staffValidated}
        />
      </div>

      {/* Profile card */}
      {profile && (
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            {profile.username?.charAt(0)?.toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <h2>{profile.username}</h2>
            <p className={styles.profileRole}>{role}</p>
            {profile.phoneNumber && (
              <p className={styles.profileDetail}>📞 {profile.phoneNumber}</p>
            )}
          </div>
          {profile.skills?.length > 0 && (
            <div className={styles.profileSkills}>
              <p className={styles.skillsLabel}>
                Skills ({profile.skills.length})
              </p>
              <div className={styles.skillTags}>
                {profile.skills.slice(0, 4).map((sk, i) => (
                  <span key={i} className={styles.skillTag}>
                    Lv.{sk.level}
                  </span>
                ))}
                {profile.skills.length > 4 && (
                  <span className={styles.skillTag}>
                    +{profile.skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div className={styles.sectionTitle}>Quick Actions</div>
      <div className={styles.quickGrid}>
        {QUICK.map((q) => (
          <Link key={q.to} to={q.to} className={styles.quickCard}>
            <div className={styles.quickIcon}>{q.icon}</div>
            <div>
              <p className={styles.quickLabel}>{q.label}</p>
              <p className={styles.quickDesc}>{q.desc}</p>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, green }) {
  return (
    <div
      className={[
        styles.statCard,
        accent ? styles.statAccent : "",
        green ? styles.statGreen : "",
      ].join(" ")}
    >
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
