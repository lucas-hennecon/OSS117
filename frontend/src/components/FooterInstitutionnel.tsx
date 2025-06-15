
export default function FooterInstitutionnel() {
  return (
    <footer className="bg-white border-t border-border mt-16 py-8 text-center text-xs text-secondary-text">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-3xl mx-auto px-4 gap-1">
        <div>
          <span className="font-bold text-primary-text">AI-generated analyses require journalistic validation.</span>
        </div>
        <div>
          OSS117 Agent v1.0 – Advanced Fact-Checking Technology
          <span className="mx-2 text-border">|</span>
          <a href="#" className="hover:underline">Methodology</a>
          <span className="mx-1 text-border">/</span>
          <a href="#" className="hover:underline">About</a>
          <span className="mx-1 text-border">/</span>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  )
}
