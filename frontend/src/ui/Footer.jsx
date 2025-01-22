import instLogo from "../assets/instLogo.png";
import telegramLogo from "../assets/telegramLogo.png";
import facebookLogo from "../assets/facebookLogo.png";
import youtubeLogo from "../assets/youtubeLogo.png";
import twitterLogo from "../assets/twitterLogo.png";
import linkedinLogo from "../assets/linkedinLogo.png";

function Footer() {
  return (
    <footer className="px-4 py-7 flex items-center justify-between bg-gradient-to-l from-blue-500 to-blue-300">
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-blue-50 hover:underline font-semibold"
        href="https://www.unime.it/"
      >
        Official Website
      </a>

      {/* Навігація */}
      <nav className="space-x-4 flex">
        <a
          href="https://www.instagram.com/unime.it/?hl=it"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="h-7" src={instLogo} alt="Instagram Link" />
        </a>
        <a href="https://t.me/unime" target="_blank" rel="noopener noreferrer">
          <img className="h-7" src={telegramLogo} alt="Telegram Link" />
        </a>
        <a
          href="https://www.facebook.com/messinauniversity"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="h-7" src={facebookLogo} alt="Facebook Link" />
        </a>
        <a
          href="https://www.youtube.com/channel/UC0-ACMYaIsA4GX_uMEm1TmA"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="h-7" src={youtubeLogo} alt="Youtube Link" />
        </a>
        <a
          href="https://x.com/unimessina"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="h-7" src={twitterLogo} alt="Twitter Link" />
        </a>
        <a
          href="https://www.linkedin.com/school/unimeofficial/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="h-7" src={linkedinLogo} alt="LinkedIn Link" />
        </a>
      </nav>
    </footer>
  );
}

export default Footer;
