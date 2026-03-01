import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/213555123456?text=Bonjour%2C%20je%20suis%20intéressé%20par%20vos%20produits"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-40 w-12 h-12 bg-foreground text-background flex items-center justify-center hover:bg-silver-light transition-colors duration-300"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle size={22} strokeWidth={1.5} />
    </a>
  );
}
