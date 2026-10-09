"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Car,
  Clock,
  MapPin,
  Navigation,
  History,
  Wallet,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Check,
  Bell,
  Menu,
  X,
  Leaf,
  Users,
  Compass,
  Download,
  LoaderCircle,
} from "lucide-react";
const places = [
  "Indiranagar",
  "MG Road",
  "Koramangala",
  "Bengaluru Airport",
  "Whitefield",
  "Cubbon Park",
];
const types = [
  {
    id: "go",
    name: "Orbit Go",
    desc: "A little everyday magic",
    rate: 14,
    time: "3 min",
    icon: Car,
  },
  {
    id: "comfort",
    name: "Orbit Comfort",
    desc: "More room. More you.",
    rate: 19,
    time: "5 min",
    icon: Leaf,
  },
  {
    id: "xl",
    name: "Orbit XL",
    desc: "Bring your whole crew",
    rate: 25,
    time: "7 min",
    icon: Users,
  },
];
const labels: any = {
  requested: "Finding your driver",
  accepted: "Driver on the way",
  arrived: "Driver has arrived",
  in_progress: "Enjoy your ride",
  completed: "Ride completed",
  cancelled: "Ride cancelled",
};
function CityMap({ active }: { active: any }) {
  return (
    <div className="city-map">
      <svg
        viewBox="0 0 900 680"
        role="img"
        aria-label="Illustrated Bengaluru route preview, not a live navigation map"
      >
        <defs>
          <pattern
            id="blocks"
            width="115"
            height="92"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-15)"
          >
            <rect width="115" height="92" fill="#efeee8" />
            <rect x="8" y="8" width="91" height="69" rx="10" fill="#e4e3dc" />
            <path d="M0 86H115M108 0V92" stroke="#fffefa" strokeWidth="12" />
          </pattern>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity=".15" />
          </filter>
        </defs>
        <rect width="900" height="680" fill="url(#blocks)" />
        <path
          d="M-30 260Q200 340 345 180T950 260"
          stroke="#dae6c9"
          strokeWidth="95"
          fill="none"
        />
        <path
          d="M680 -30Q550 220 740 410T650 720"
          stroke="#c7dee0"
          strokeWidth="47"
          fill="none"
        />
        <path
          d="M-10 520L920 250M210 -10L520 700"
          stroke="white"
          strokeWidth="25"
        />
        <path
          d="M-10 520L920 250M210 -10L520 700"
          stroke="#d8d6cc"
          strokeWidth="2"
          strokeDasharray="8 7"
        />
        <g
          fill="#888c83"
          fontSize="13"
          fontFamily="sans-serif"
          letterSpacing="2"
        >
          <text x="110" y="175">
            CUBBON PARK
          </text>
          <text x="585" y="150">
            ULSOOR LAKE
          </text>
          <text x="85" y="435">
            RICHMOND TOWN
          </text>
          <text x="510" y="510">
            INDIRANAGAR
          </text>
          <text x="605" y="600">
            DOMLUR
          </text>
          <text x="350" y="280">
            MG ROAD
          </text>
        </g>
        <path
          d="M540 449L480 340L368 372L330 310"
          fill="none"
          stroke="white"
          strokeWidth="13"
          strokeLinejoin="round"
        />
        <path
          d="M540 449L480 340L368 372L330 310"
          fill="none"
          stroke="#eb633f"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeDasharray={active ? "0" : "9 5"}
        />
        <circle
          cx="540"
          cy="449"
          r="19"
          fill="#193f36"
          stroke="white"
          strokeWidth="7"
        />
        <circle
          cx="330"
          cy="310"
          r="19"
          fill="#eb633f"
          stroke="white"
          strokeWidth="7"
        />
        <g filter="url(#shadow)">
          <rect x="278" y="252" width="110" height="35" rx="17" fill="#fff" />
          <text
            x="294"
            y="275"
            fontFamily="sans-serif"
            fontSize="12"
            fill="#243b32"
          >
            Your destination
          </text>
          <rect x="500" y="475" width="86" height="35" rx="17" fill="#193f36" />
          <text
            x="516"
            y="498"
            fontFamily="sans-serif"
            fontSize="12"
            fill="white"
          >
            Pick-up point
          </text>
        </g>
        {[
          [430, 190],
          [220, 470],
          [630, 330],
          [390, 520],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y}) rotate(-15)`}>
            <rect
              width="17"
              height="29"
              rx="6"
              fill="#fff"
              stroke="#9a9f94"
              strokeWidth="2"
            />
            <rect x="3" y="6" width="11" height="10" rx="2" fill="#9aafa6" />
          </g>
        ))}
      </svg>
      <div className="map-label">
        <span className="pulse" /> BENGALURU{" "}
        <span>Illustrated route preview</span>
      </div>
      <div className="map-legend">
        <Navigation size={16} /> Your city. A little closer.
      </div>
    </div>
  );
}
export default function Orbit() {
  const [view, setView] = useState("book"),
    [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [pickup, setPickup] = useState("Indiranagar"),
    [destination, setDestination] = useState("MG Road"),
    [type, setType] = useState("go"),
    [notice, setNotice] = useState(""),
    [mobile, setMobile] = useState(false),
    [rating, setRating] = useState(5),
    [review, setReview] = useState("");
  async function load() {
    try {
      const r = await fetch("/api/orbit");
      const d: any = await r.json();
      if (!r.ok) {
        setError(d.error);
        return;
      }
      setData(d);
      setError("");
    } catch {
      setError("Unable to connect. Please try again.");
    }
  }
  useEffect(() => {
    load();
    const t = setInterval(load, 6000);
    return () => clearInterval(t);
  }, []);
  async function act(payload: any) {
    setBusy(true);
    setNotice("");
    try {
      const r = await fetch("/api/orbit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d: any = await r.json();
      if (!r.ok) throw Error(d.error);
      await load();
      setNotice(
        payload.action === "book"
          ? "Ride requested. Your next chapter starts here."
          : payload.action === "profile"
            ? "Profile saved."
            : "All set. Your ride is updated.",
      );
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Something went wrong.");
    }
    setBusy(false);
  }
  const profile = data?.profile,
    driver = profile?.role === "driver",
    rides = data?.rides || [],
    active = rides.find(
      (r: any) =>
        !["completed", "cancelled"].includes(r.status) &&
        (driver ? r.driverId === profile.id : true),
    ),
    distance =
      Math.abs(places.indexOf(pickup) - places.indexOf(destination)) * 3.2 +
      2.4,
    completed = rides.filter((r: any) => r.status === "completed"),
    fare = (rate: number) => Math.round(45 + distance * rate);
  function receipt(r: any) {
    const txt = `ORBIT • RIDE RECEIPT\n${r.id}\nDate: ${new Date(r.created).toLocaleString()}\nFrom: ${r.pickup}\nTo: ${r.destination}\nClass: ${r.type}\nEstimated distance: ${r.distance.toFixed(1)} km\nFare: INR ${r.fare}\nPayment: Cash, recorded at completion\nDriver: ${r.driver?.name || "—"}\nThank you for riding with Orbit.`;
    const url = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `orbit-receipt-${r.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
  const nav = [
    { id: "book", label: driver ? "Driver hub" : "Book a ride", icon: Compass },
    { id: "history", label: "Your journeys", icon: History },
    { id: "wallet", label: driver ? "Earnings" : "Payments", icon: Wallet },
    { id: "profile", label: "Your profile", icon: Settings },
  ];
  return (
    <div className="shell">
      <aside className={mobile ? "sidebar open" : "sidebar"}>
        <a className="brand" href="/">
          orbit<span>↗</span>
        </a>
        <div className="brand-caption">MAKE ROOM FOR LIFE.</div>
        <button
          className="mobile-close"
          onClick={() => setMobile(false)}
          aria-label="Close menu"
        >
          <X />
        </button>
        <div className="workspace">
          <span className="workspace-icon">
            <Navigation size={18} />
          </span>
          <div>
            Bengaluru<small>Your city, connected</small>
          </div>
          <span className="status-dot" />
        </div>
        <nav>
          {nav.map((n) => (
            <button
              key={n.id}
              className={view === n.id ? "selected" : ""}
              onClick={() => {
                setView(n.id);
                setMobile(false);
              }}
            >
              <n.icon size={19} />
              {n.label}
              {view === n.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="driver-promo">
            <span>THE ROAD IS YOURS</span>
            <h3>
              {driver
                ? "Every trip. A new opportunity."
                : "Good at going places?"}
            </h3>
            <p>
              {driver
                ? "Your driver dashboard is ready when you are."
                : "Turn your everyday drives into something more."}
            </p>
            <button onClick={() => setView("profile")}>
              {driver ? "Manage driver profile" : "Become a driver"}
              <ArrowUpRight size={16} />
            </button>
          </div>
          <button className="user" onClick={() => setView("profile")}>
            <span className="avatar">{profile?.name?.charAt(0) || "O"}</span>
            <span>
              {profile?.name || "Welcome to Orbit"}
              <small>{driver ? "Driver account" : "Personal account"}</small>
            </span>
            <Settings size={16} />
          </button>
          <a
            className="signout"
            href="/signout-with-chatgpt?return_to=/"
            target="_top"
          >
            <LogOut size={14} /> Sign out
          </a>
        </div>
      </aside>
      <main>
        <header>
          <button
            className="mobile-menu"
            onClick={() => setMobile(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            Your everyday, elevated <span>/</span>{" "}
            <b>{nav.find((n) => n.id === view)?.label}</b>
          </div>
          <div className="header-right">
            <span className="city-weather">
              ☀ 26° <span>Bengaluru</span>
            </span>
            <button
              aria-label="Ride updates"
              title="Ride updates"
              onClick={() =>
                setNotice(
                  active
                    ? labels[active.status]
                    : "You’re all caught up. Ride updates appear here.",
                )
              }
            >
              <Bell size={19} />
              <i />
            </button>
          </div>
        </header>
        <div className="content">
          <div className="intro">
            <div>
              <div className="eyebrow">
                A LITTLE LESS WAITING. A LITTLE MORE LIVING.
              </div>
              <h1>
                {view === "book"
                  ? driver
                    ? "Hello, road explorer."
                    : "Where to next?"
                  : view === "history"
                    ? "Every journey tells a story."
                    : view === "wallet"
                      ? driver
                        ? "Your miles, rewarded."
                        : "Keep it effortless."
                      : "Make yourself at home."}
              </h1>
              <p>
                {view === "book"
                  ? "The meeting. The catch-up. The just-because. We’ll get you there."
                  : view === "history"
                    ? "All your trips, receipts and little adventures, in one place."
                    : view === "wallet"
                      ? "A clear view of what comes and goes."
                      : "A few details to make every ride feel more like you."}
              </p>
            </div>
            <div className="live-badge">
              <span className="pulse" />{" "}
              {driver ? "DRIVER MODE" : "LET’S GO PLACES"}
            </div>
          </div>
          {error && (
            <div className="alert">
              {error}{" "}
              <a href="/signin-with-chatgpt?return_to=/" target="_top">
                Sign in with ChatGPT <ArrowRight size={14} />
              </a>
              <button onClick={load}>Retry</button>
            </div>
          )}
          {notice && (
            <div className="toast" role="status">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          )}
          {view === "book" && (
            <>
              <div className="booking-grid">
                <section className="booking-card">
                  <div className="card-top">
                    <h2>
                      {driver
                        ? "Your driver hub"
                        : active
                          ? "Your ride, in motion"
                          : "Let’s get you moving"}
                    </h2>
                    <span>01 / JOURNEY</span>
                  </div>
                  {active ? (
                    <>
                      <div className="ride-status">
                        <span className="pulse" />
                        {labels[active.status]}
                      </div>
                      <div className="route-summary">
                        <span>{active.pickup}</span>
                        <ArrowRight size={18} />
                        <span>{active.destination}</span>
                      </div>
                      <div className="driver-detail">
                        <span className="avatar">
                          {(driver
                            ? active.rider?.name
                            : active.driver?.name
                          )?.charAt(0) || "…"}
                        </span>
                        <div>
                          <b>
                            {driver
                              ? active.rider?.name || "Rider"
                              : active.driver?.name ||
                                "Waiting for an available driver"}
                          </b>
                          <small>
                            {driver
                              ? active.rider?.phone
                              : active.driver?.phone ||
                                "Status refreshes every 6 seconds"}
                          </small>
                        </div>
                      </div>
                      <div className="trip-facts">
                        <div>
                          <small>RIDE CLASS</small>
                          <b>Orbit {active.type}</b>
                        </div>
                        <div>
                          <small>FARE ESTIMATE</small>
                          <b>₹{active.fare}</b>
                        </div>
                      </div>
                      {driver ? (
                        <button
                          disabled={busy}
                          className="primary"
                          onClick={() =>
                            act({ action: "advance", id: active.id })
                          }
                        >
                          {
                            (
                              {
                                accepted: "I’ve arrived",
                                arrived: "Start ride",
                                in_progress: "Complete ride & record cash",
                              } as any
                            )[active.status]
                          }
                          <ArrowRight size={18} />
                        </button>
                      ) : (
                        <button
                          disabled={busy || active.status === "in_progress"}
                          className="secondary"
                          onClick={() =>
                            act({ action: "cancel", id: active.id })
                          }
                        >
                          Cancel ride
                        </button>
                      )}
                      <p className="fine">
                        Cash payment is recorded when the driver completes the
                        ride.
                      </p>
                    </>
                  ) : driver ? (
                    <>
                      <div className="driver-ready">
                        <Car size={35} />
                        <h3>Ready when you are.</h3>
                        <p>
                          Accept a request below to start your next journey.
                        </p>
                      </div>
                      {rides.filter(
                        (r: any) =>
                          r.status === "requested" && r.riderId !== profile?.id,
                      ).length === 0 ? (
                        <div className="empty-mini">
                          No open requests yet. This hub refreshes
                          automatically.
                        </div>
                      ) : (
                        rides
                          .filter(
                            (r: any) =>
                              r.status === "requested" &&
                              r.riderId !== profile?.id,
                          )
                          .map((r: any) => (
                            <div className="request" key={r.id}>
                              <b>
                                {r.pickup} → {r.destination}
                              </b>
                              <p>
                                {r.distance.toFixed(1)} km · ₹{r.fare} · Orbit{" "}
                                {r.type}
                              </p>
                              <button
                                className="primary"
                                disabled={busy}
                                onClick={() =>
                                  act({ action: "accept", id: r.id })
                                }
                              >
                                Accept request
                                <ArrowRight size={16} />
                              </button>
                            </div>
                          ))
                      )}
                    </>
                  ) : (
                    <>
                      <div className="route-inputs">
                        <div className="route-line" />
                        <label>
                          <span className="origin-dot" />
                          <div>
                            <small>PICK-UP LOCATION</small>
                            <select
                              aria-label="Pickup location"
                              value={pickup}
                              onChange={(e) => setPickup(e.target.value)}
                            >
                              {places.map((p) => (
                                <option key={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                          <Navigation size={17} />
                        </label>
                        <label>
                          <MapPin size={19} color="#e96a47" />
                          <div>
                            <small>WHERE ARE YOU HEADED?</small>
                            <select
                              aria-label="Destination"
                              value={destination}
                              onChange={(e) => setDestination(e.target.value)}
                            >
                              {places.map((p) => (
                                <option key={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                        </label>
                      </div>
                      <div className="journey-meta">
                        <Clock size={14} />
                        <span>Leave now</span>
                        <span>•</span>
                        <span>{distance.toFixed(1)} km estimate</span>
                        <button
                          onClick={() => {
                            setPickup(destination);
                            setDestination(pickup);
                          }}
                        >
                          Swap ↕
                        </button>
                      </div>
                      <div className="choose-title">
                        <h3>Your ride. Your rhythm.</h3>
                        <span>03 options</span>
                      </div>
                      <div className="ride-options">
                        {types.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setType(t.id)}
                            className={
                              type === t.id
                                ? "ride-option chosen"
                                : "ride-option"
                            }
                          >
                            <span className="car-icon">
                              <t.icon size={27} />
                            </span>
                            <span>
                              <b>{t.name}</b>
                              <small>{t.desc}</small>
                              <em>{t.time} illustrative ETA</em>
                            </span>
                            <span className="fare">
                              ₹{fare(t.rate)}
                              <small>
                                {type === t.id ? (
                                  <Check size={14} />
                                ) : (
                                  <span className="radio" />
                                )}
                              </small>
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="payment-row">
                        <Wallet size={17} />
                        <span>
                          Pay with cash<small>No card needed</small>
                        </span>
                        <span>₹ INR</span>
                      </div>
                      <button
                        className="primary"
                        disabled={busy || !profile || pickup === destination}
                        onClick={() =>
                          act({ action: "book", pickup, destination, type })
                        }
                      >
                        {busy ? (
                          <LoaderCircle className="spin" size={18} />
                        ) : (
                          <>
                            Request {types.find((t) => t.id === type)?.name}
                            <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                      <div className="fine">
                        Estimates use sample distances. No live dispatch or card
                        charge.
                      </div>
                    </>
                  )}
                </section>
                <section className="map-card">
                  <CityMap active={active} />
                  <div className="map-footer">
                    <div className="map-footer-icon">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <b>A city full of possibilities.</b>
                      <span>One ride away from your next good moment.</span>
                    </div>
                    <span className="map-footer-arrow">
                      <ArrowUpRight size={23} />
                    </span>
                  </div>
                </section>
              </div>
              <div className="bottom-grid">
                <section className="inspiration">
                  <div>
                    <span className="eyebrow">
                      LESS FOOTPRINT. MORE FORWARD.
                    </span>
                    <h3>
                      Small rides.
                      <br />
                      Better tomorrows.
                    </h3>
                    <p>Choose Comfort for a little extra breathing room.</p>
                    <button
                      onClick={() => {
                        setType("comfort");
                        setNotice("Orbit Comfort selected for your next ride.");
                      }}
                    >
                      Explore Comfort <ArrowUpRight size={17} />
                    </button>
                  </div>
                  <div className="eco-art">
                    <Leaf size={62} />
                    <span>
                      GO
                      <br />
                      GENTLY.
                    </span>
                  </div>
                </section>
                <section className="recent">
                  <div className="section-heading">
                    <h3>Your latest journey</h3>
                    <button onClick={() => setView("history")}>
                      View all <ArrowUpRight size={15} />
                    </button>
                  </div>
                  {rides[0] ? (
                    <div className="recent-ride">
                      <span className="recent-car">
                        <Car />
                      </span>
                      <div>
                        <b>{rides[0].destination}</b>
                        <small>
                          {new Date(rides[0].created).toLocaleDateString()} ·{" "}
                          {labels[rides[0].status]}
                        </small>
                        <span>From {rides[0].pickup}</span>
                      </div>
                      <b>₹{rides[0].fare}</b>
                    </div>
                  ) : (
                    <div className="first-journey">
                      <Compass size={27} />
                      <div>
                        <b>Your first story starts here.</b>
                        <p>
                          Request a ride and we’ll keep the details for you.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="recent-note">
                    <Check size={14} /> Your journeys are saved securely to your
                    account.
                  </div>
                </section>
              </div>
            </>
          )}
          {view === "history" && (
            <section className="wide-card">
              <div className="section-heading">
                <h2>
                  Your journeys <span className="count">{rides.length}</span>
                </h2>
              </div>
              {!rides.length && (
                <div className="empty">
                  <History size={42} />
                  <h3>Places to go. Stories to make.</h3>
                  <p>Your rides will appear here after you book.</p>
                  <button className="primary" onClick={() => setView("book")}>
                    Book your first ride <ArrowRight size={18} />
                  </button>
                </div>
              )}
              {rides.map((r: any) => (
                <div className="history-item" key={r.id}>
                  <div className="history-main">
                    <span className="recent-car">
                      <Car />
                    </span>
                    <div>
                      <b>
                        {r.pickup} → {r.destination}
                      </b>
                      <small>
                        {new Date(r.created).toLocaleString()} · Orbit {r.type}{" "}
                        · {r.distance.toFixed(1)} km estimate
                      </small>
                    </div>
                    <span className={"status " + r.status}>
                      {labels[r.status]}
                    </span>
                    <b>₹{r.fare}</b>
                  </div>
                  {r.status === "completed" && (
                    <div className="history-actions">
                      <button className="secondary" onClick={() => receipt(r)}>
                        <Download size={15} /> Receipt
                      </button>
                      {!driver &&
                        (r.rating ? (
                          <span className="rated">
                            <Star size={15} /> {r.rating}/5 ·{" "}
                            {r.review || "Thanks for your feedback"}
                          </span>
                        ) : (
                          <div className="review-form">
                            <select
                              aria-label="Rating"
                              value={rating}
                              onChange={(e) =>
                                setRating(Number(e.target.value))
                              }
                            >
                              {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>
                                  {n} stars
                                </option>
                              ))}
                            </select>
                            <input
                              aria-label="Review"
                              placeholder="How was your ride?"
                              value={review}
                              maxLength={500}
                              onChange={(e) => setReview(e.target.value)}
                            />
                            <button
                              disabled={busy}
                              onClick={() =>
                                act({
                                  action: "review",
                                  id: r.id,
                                  rating,
                                  review,
                                })
                              }
                            >
                              Submit review
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
          {view === "wallet" && (
            <>
              <div className="metrics">
                <div>
                  <small>{driver ? "TOTAL EARNINGS" : "TOTAL SPENT"}</small>
                  <h2>
                    ₹
                    {completed
                      .reduce((s: number, r: any) => s + r.fare, 0)
                      .toLocaleString("en-IN")}
                  </h2>
                  <span>Recorded cash payments</span>
                </div>
                <div>
                  <small>COMPLETED JOURNEYS</small>
                  <h2>{completed.length}</h2>
                  <span>A little further, together</span>
                </div>
                <div>
                  <small>PAYMENT METHOD</small>
                  <h2>
                    Cash <Wallet size={28} />
                  </h2>
                  <span>Pay your driver after your ride</span>
                </div>
              </div>
              <section className="wide-card">
                <h2>Payment activity</h2>
                <p className="fine">
                  Card payments are not enabled. Amounts below record cash
                  collection confirmed by the driver.
                </p>
                {completed.length ? (
                  completed.map((r: any) => (
                    <div className="payment-entry" key={r.id}>
                      <span className="recent-car">
                        <Check />
                      </span>
                      <div>
                        <b>{r.destination}</b>
                        <small>
                          {new Date(r.created).toLocaleDateString()} · Cash
                          recorded
                        </small>
                      </div>
                      <b>₹{r.fare}</b>
                      <button className="secondary" onClick={() => receipt(r)}>
                        <Download size={16} /> Receipt
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty">
                    <Wallet size={35} />
                    <h3>A clean slate.</h3>
                    <p>Completed ride payments will appear here.</p>
                  </div>
                )}
              </section>
            </>
          )}
          {view === "profile" && (
            <section className="profile-card">
              <div className="profile-cover">
                <div className="orbit-rings" />
                <span className="avatar large">
                  {profile?.name?.charAt(0) || "O"}
                </span>
                <h2>Your own little Orbit.</h2>
              </div>
              {profile && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    act({
                      action: "profile",
                      name: f.get("name"),
                      phone: f.get("phone"),
                      role: f.get("role"),
                      avatar: f.get("avatar"),
                    });
                  }}
                >
                  <div className="form-grid">
                    <label>
                      Full name
                      <input
                        name="name"
                        defaultValue={profile.name}
                        required
                        maxLength={80}
                      />
                    </label>
                    <label>
                      Phone number
                      <input
                        name="phone"
                        defaultValue={profile.phone}
                        placeholder="+91 98765 43210"
                        maxLength={30}
                      />
                    </label>
                    <label>
                      Profile image URL
                      <input
                        name="avatar"
                        type="url"
                        defaultValue={profile.avatar}
                        placeholder="https://…"
                      />
                      {profile.avatar && (
                        <img
                          className="profile-photo"
                          src={profile.avatar}
                          alt="Your profile"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </label>
                    <label>
                      Your account mode
                      <select name="role" defaultValue={profile.role}>
                        <option value="rider">
                          Rider — find your next ride
                        </option>
                        <option value="driver">
                          Driver — accept ride requests
                        </option>
                      </select>
                    </label>
                  </div>
                  <p className="fine">
                    Driver mode is for this project’s test workflow. It does not
                    verify a commercial driver or vehicle. Use a second
                    signed-in account to test matching.
                  </p>
                  <button className="primary" disabled={busy}>
                    Save changes <Check size={18} />
                  </button>
                </form>
              )}
            </section>
          )}
          <footer>
            <span>
              orbit ↗ <span>A better way to get there.</span>
            </span>
            <span>
              Made for the everyday adventure.{" "}
              <span>© {new Date().getFullYear()} Orbit</span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
