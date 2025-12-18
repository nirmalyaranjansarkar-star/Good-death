import React, { useState } from 'react';
import { AppSection } from './types';
import { ChatInterface } from './components/ChatInterface';
import { PlanningTools } from './components/PlanningTools';
import { Feather, Heart, Map, ListChecks, Menu, X, Anchor, Search } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ section, icon: Icon, label }: { section: AppSection; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveSection(section);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
        activeSection === section
          ? 'bg-sage-700 text-white shadow-md'
          : 'text-sage-800 hover:bg-sage-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeSection) {
      case AppSection.SERVICES:
        return <ChatInterface contextMode="services" />;
      case AppSection.PLANNING:
        return <PlanningTools />;
      case AppSection.HOME:
      default:
        return (
          <div className="space-y-16 animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="text-center space-y-6 pt-10 px-4">
              <div className="inline-block p-3 bg-sage-100 rounded-full mb-2">
                <Anchor className="w-8 h-8 text-sage-600" />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-sage-900 leading-tight">
                Embracing Life, <br/>
                <span className="text-sage-600 italic">Planning for the End</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Welcome to <strong>Good Death</strong>. We empower you with the tools, knowledge, and support to navigate the end of life with dignity, clarity, and peace.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button 
                  onClick={() => setActiveSection(AppSection.PLANNING)}
                  className="px-8 py-3 bg-sage-700 text-white rounded-xl font-medium shadow-lg hover:bg-sage-800 transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <ListChecks className="w-5 h-5" />
                  Start Planning Checklist
                </button>
                <button 
                  onClick={() => setActiveSection(AppSection.SERVICES)}
                  className="px-8 py-3 bg-white text-sage-800 border border-sage-200 rounded-xl font-medium shadow-sm hover:bg-sage-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Find Local Services
                </button>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mb-6 text-sage-700">
                  <Map className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-sage-900 mb-3">Service Directory</h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                  Find trusted palliative care centers, hospices, funeral homes, and legal experts in your area.
                </p>
                <button onClick={() => setActiveSection(AppSection.SERVICES)} className="text-sage-600 font-medium hover:underline text-sm">Find nearby &rarr;</button>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mb-6 text-sage-700">
                  <ListChecks className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-sage-900 mb-3">Planning Tools</h3>
                <p className="text-stone-600 leading-relaxed mb-4">
                  Interactive checklists for Wills, Advance Directives, and Digital Legacies to ensuring nothing is left to chance.
                </p>
                <button onClick={() => setActiveSection(AppSection.PLANNING)} className="text-sage-600 font-medium hover:underline text-sm">Start planning &rarr;</button>
              </div>
            </section>

            {/* Quote Section */}
            <section className="bg-sage-50 py-16 px-4 rounded-3xl mx-4">
              <div className="max-w-3xl mx-auto text-center">
                <Feather className="w-8 h-8 text-sage-400 mx-auto mb-6" />
                <blockquote className="text-2xl font-serif text-sage-800 italic mb-6">
                  "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time."
                </blockquote>
                <cite className="text-sage-600 font-medium not-italic">— Mark Twain</cite>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setActiveSection(AppSection.HOME)}
          >
            <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center text-white">
              <Anchor className="w-5 h-5" />
            </div>
            <span className="text-xl font-serif font-bold text-sage-900 tracking-tight">Good Death</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItem section={AppSection.HOME} icon={Feather} label="Home" />
            <NavItem section={AppSection.SERVICES} icon={Map} label="Find Services" />
            <NavItem section={AppSection.PLANNING} icon={ListChecks} label="Planning" />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-sage-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 p-4 space-y-2 shadow-lg absolute w-full">
            <button
              onClick={() => { setActiveSection(AppSection.HOME); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-sage-50 text-sage-800 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => { setActiveSection(AppSection.SERVICES); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-sage-50 text-sage-800 font-medium"
            >
              Find Services
            </button>
            <button
              onClick={() => { setActiveSection(AppSection.PLANNING); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-sage-50 text-sage-800 font-medium"
            >
              Planning
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-sage-900 text-sage-100 py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Anchor className="w-5 h-5" />
              <span className="text-xl font-serif font-bold text-white">Good Death</span>
            </div>
            <p className="text-sage-300 max-w-sm leading-relaxed">
              Based on the Good Death mission. Helping you navigate life's final chapter with clarity, love, and dignity.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sage-300">
              <li><button onClick={() => setActiveSection(AppSection.PLANNING)} className="hover:text-white transition-colors">Advance Directives</button></li>
              <li><button onClick={() => setActiveSection(AppSection.SERVICES)} className="hover:text-white transition-colors">Find Hospice</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sage-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-sage-800 text-center text-sage-400 text-sm">
          © {new Date().getFullYear()} Good Death. Information provided is for educational purposes only.
        </div>
      </footer>
    </div>
  );
}

export default App;