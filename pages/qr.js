import Head from "next/head";
import styles from "../styles/Home.module.css";
import logo from "../public/dolapk.png";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Home() {
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowForm(true);
    }, 2000);
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Dolapk</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className="main"
        style={{
          display: !showForm ? "none" : "block",
        }}
      >
        <div className="back"></div>
        <div className="form">
          <div className="form-header"></div>
          <div className="yellow-box">
            <p className="main">
              تابع حسابتنا علي السوشيال ميديا ليصلك كل جديد
            </p>
            <br />
            <p className="sub">
              Follow us and get updates delivered to your favorite social media
              channel.
            </p>
          </div>
          <div className="links">
            <div style={{ width: "100%" }}>
              <Link href="//www.dolapk.com/">
                <a className="link">
                  <div className="icon first-icon"></div>
                  <div className="data">
                    <p className="header-p">Visit Dolapk Online</p>
                    <p className="subtitle-p">Coming soon...</p>
                  </div>
                </a>
              </Link>
            </div>
            <div style={{ width: "100%" }}>
              <Link href="//www.facebook.com/Dolapk-104464171080724/">
                <a className="link">
                  <div className="icon second-icon"></div>
                  <div className="data">
                    <p className="header-p">Facebook</p>
                    <p className="subtitle-p">Become a fan for Dolapk</p>
                  </div>
                </a>
              </Link>
            </div>
            <div style={{ width: "100%" }}>
              <Link href="//www.instagram.com/dolapk_">
                <a className="link">
                  <div className="icon third-icon"></div>
                  <div className="data">
                    <p className="header-p">Instagram</p>
                    <p className="subtitle-p">Follow Dolapk</p>
                  </div>
                </a>
              </Link>
            </div>
            <div style={{ width: "100%" }}>
              <a className="link" href="https://wa.me/201004717429">
                <div className="icon fourth-icon"></div>
                <div className="data">
                  <p className="header-p">Whatsapp</p>
                  <p className="subtitle-p">Contact Us</p>
                </div>
              </a>
            </div>
          </div>
          <div className="btn-container">
            <Link href="//www.facebook.com/Dolapk-104464171080724/">
              <a className="btn">Share this page</a>
            </Link>
          </div>
        </div>
      </main>

      <div
        style={{
          display: showForm ? "none" : "block",
        }}
      >
        <header className="header">
          <div className="progress">
            <div className="loading"></div>
          </div>
        </header>
        <div>
          <img src={logo} width="500" height="500" className="logo" />
        </div>
      </div>
    </div>
  );
}
