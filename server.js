/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { QUESTIONS, SECTIONS } from '../data/defaultQuestionnaire';
import { 
  Sparkles, CheckCircle, ArrowRight, ArrowLeft, Send, Award, Clock, ShieldCheck, Mail
} from 'lucide-react';

export default function ClientAssessmentView() {
  const [step, setStep] = useState<'welcome' | 'questions' | 'thanks'>('welcome');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Loading & Submission State
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [submissionResult, setSubmissionResult] = useState<{ id: string; overallHealthScore: number; emailSent?: boolean; emailDetails?: any } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentSection = SECTIONS[currentSectionIndex];
  const sectionQuestions = QUESTIONS.filter(q => q.sectionId === currentSection.id);

  const handleOptionChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNextSection = () => {
    if (currentSectionIndex < SECTIONS.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isSectionComplete = () => {
    return sectionQuestions.every(q => {
      if (!q.required) return true;
      return !!answers[q.id];
    });
  };

  const isFormComplete = () => {
    return QUESTIONS.every(q => {
      if (!q.required) return true;
      return !!answers[q.id];
    });
  };

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      setErrorMsg("Inserisci il nome della tua azienda per procedere.");
      return;
    }
    if (!isFormComplete()) {
      setErrorMsg("Completa tutte le domande richieste prima di inviare.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const messages = [
      "Trasmissione sicura dei dati organizzativi...",
      "Analisi dei flussi di lavoro in corso...",
      "Calcolo degli indici di salute organizzativa...",
      "Elaborazione dei pain points qualitativi...",
      "Salvataggio nel database centrale e attivazione notifiche..."
    ];

    let msgIdx = 0;
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 1200);

    try {
      const response = await fetch('/api/assessments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyName,
          contactName,
          contactPhone,
          answers
        })
      });

      if (!response.ok) {
        throw new Error("Errore del server durante il salvataggio.");
      }

      const data = await response.json();
      setSubmissionResult(data);
      clearInterval(interval);
      setStep('thanks');
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Impossibile salvare i dati al momento. Verifica la connessione.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 antialiased selection:bg-blue-900 selection:text-white font-sans">
      
      {/* Client header - elegant and clean, no administrative links */}
      <div className="w-full max-w-2xl text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-900 text-white p-2.5 rounded-xl shadow-xs mb-3">
          <Award className="w-5 h-5 text-emerald-400" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-slate-800">
          Business Assessment Panel
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold italic">
          Metodo di Diagnosi Organizzativa Senior per PMI
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
        
        {/* Phase 1: Welcome Screen */}
        {step === 'welcome' && (
          <div className="p-6 sm:p-10 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] bg-blue-50 text-blue-900 border border-blue-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Benvenuto all'Assessment Strategico
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Misura la salute e l'autonomia della tua azienda
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Questo test strutturato è composto da 18 domande mirate che valutano le aree critiche di una PMI: 
                la dipendenza dal titolare, la chiarezza dei ruoli, l'efficienza dei processi e la ritenzione del team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Tempo stimato</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Circa 10-12 minuti per una compilazione accurata.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Massima Riservatezza</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tutti i dati sono protetti e visibili esclusivamente al Consulente Senior.</p>
                </div>
              </div>
            </div>

            {/* Inputs Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="input-company-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Nome della tua Azienda / Ragione Sociale *
                </label>
                <input
                  id="input-company-name"
                  type="text"
                  placeholder="Es. Meccanica Rossi s.r.l."
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-slate-800 font-medium transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="input-contact-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Nome e Cognome *
                </label>
                <input
                  id="input-contact-name"
                  type="text"
                  placeholder="Es. Mario Rossi"
                  value={contactName}
                  onChange={(e) => {
                    setContactName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-slate-800 font-medium transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="input-contact-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Numero di cellulare *
                </label>
                <input
                  id="input-contact-phone"
                  type="tel"
                  placeholder="Es. +39 333 1234567"
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-slate-800 font-medium transition-all"
                />
              </div>

              {errorMsg && <p className="text-rose-600 text-xs font-bold mt-2">{errorMsg}</p>}
            </div>

            <div className="pt-2">
              <button
                id="btn-start-client-test"
                onClick={() => {
                  if (!companyName.trim()) {
                    setErrorMsg("Inserisci il nome della tua azienda per avviare il test.");
                    return;
                  }
                  if (!contactName.trim()) {
                    setErrorMsg("Inserisci il tuo nome e cognome per procedere.");
                    return;
                  }
                  if (!contactPhone.trim()) {
                    setErrorMsg("Inserisci il tuo numero di cellulare per procedere.");
                    return;
                  }
                  setStep('questions');
                }}
                className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs py-3.5 px-6 rounded-xl shadow-xs transition-all uppercase tracking-wider"
              >
                Inizia l'Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Step-by-step Questionnaire */}
        {step === 'questions' && (
          <div>
            {/* Form Progress Header */}
            <div className="bg-blue-900 text-white p-6">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-blue-100 mb-2">
                <span>Azienda: {companyName}</span>
                <span>Sezione {currentSectionIndex + 1} di {SECTIONS.length}</span>
              </div>
              <h3 className="text-sm font-bold tracking-tight text-white uppercase">
                {currentSection.title}
              </h3>
              
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-blue-950 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${((currentSectionIndex + 1) / SECTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions list */}
            <div className="p-6 sm:p-8 space-y-6">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-4 border-blue-900 border-t-emerald-400 rounded-full animate-spin" />
                  <p className="text-sm font-bold text-slate-700 animate-pulse">{loadingMessage}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {sectionQuestions.map((q) => (
                      <div key={q.id} className="space-y-3 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                        <label className="block text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                          {q.text} {q.required && <span className="text-rose-500">*</span>}
                        </label>



                        {/* SELECT TYPE QUESTION */}
                        {(q.type === 'multiple-choice' || q.type === 'boolean') && q.options && (
                          <div className="grid grid-cols-1 gap-2.5 mt-2">
                            {q.options.map((opt) => {
                              const isSelected = answers[q.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleOptionChange(q.id, opt)}
                                  className={`w-full text-left p-3.5 rounded-lg border text-xs font-semibold transition-all flex items-center justify-between ${
                                    isSelected 
                                      ? 'bg-blue-900 border-blue-900 text-white shadow-xs' 
                                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* SCALE TYPE QUESTION */}
                        {q.type === 'scale' && (
                          <div className="grid grid-cols-10 gap-1.5 mt-3">
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => {
                              const isSelected = answers[q.id] === String(val);
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => handleOptionChange(q.id, String(val))}
                                  className={`h-10 rounded-md font-bold text-xs transition-all flex items-center justify-center ${
                                    isSelected 
                                      ? 'bg-blue-900 text-white shadow-xs scale-105' 
                                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {val}
                                </button>
                              );
                            })}
                            <div className="col-span-10 flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-1">
                              <span>Minimo (Fortemente Critico)</span>
                              <span>Massimo (Soddisfatto / Eccellente)</span>
                            </div>
                          </div>
                        )}

                        {/* OPEN / TEXTAREA TYPE QUESTION */}
                        {q.type === 'open' && (
                          <div className="mt-2">
                            <textarea
                              rows={3}
                              placeholder={q.placeholder || "Inserisci i tuoi commenti..."}
                              value={answers[q.id] || ''}
                              onChange={(e) => handleOptionChange(q.id, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-900 text-slate-800 font-medium leading-relaxed"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handlePrevSection}
                      disabled={currentSectionIndex === 0}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        currentSectionIndex === 0 
                          ? 'text-slate-300 cursor-not-allowed' 
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Indietro
                    </button>

                    {errorMsg && <p className="text-rose-600 text-xs font-bold hidden sm:block">{errorMsg}</p>}

                    {currentSectionIndex < SECTIONS.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNextSection}
                        disabled={!isSectionComplete()}
                        className={`flex items-center gap-1 px-5 py-2.5 rounded-lg text-xs font-bold transition-all text-white ${
                          isSectionComplete() 
                            ? 'bg-blue-900 hover:bg-blue-800 shadow-xs' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Avanti
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isFormComplete()}
                        className={`flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold transition-all text-white ${
                          isFormComplete() 
                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-xs animate-pulse' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Invia Assessment
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Phase 3: Thank-You page */}
        {step === 'thanks' && (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-200 flex items-center justify-center rounded-full mx-auto shadow-xs">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Grazie, compilazione completata!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                I dati del tuo Business Assessment sono stati correttamente salvati ed associati alla nostra dashboard riservata.
              </p>
            </div>

            {/* Email dispatch alert */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl max-w-md mx-auto text-left flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Notifica e-mail inviata</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-normal">
                  Il nostro Consulente Senior ha ricevuto una notifica automatica in tempo reale contenente i tuoi indici di salute aziendale calcolati.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed pt-2">
              Verrai ricontattato a breve per fissare la call strategica di allineamento e approfondire i risultati emersi.
            </p>

            <div className="pt-4 border-t border-slate-100 max-w-sm mx-auto">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Advisory Business Diagnostic • PMI
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
