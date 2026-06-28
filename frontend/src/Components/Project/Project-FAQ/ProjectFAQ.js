import React from 'react'
import "./ProjectFAQ.css"

export default function ProjectFAQ() {
  return (
    <div>
        <section className="faq-section py-5" id="faq">
                <div className="container">

                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Frequently Asked Questions</h2>
                        <p className="text-muted">Answers to common questions our clients ask.</p>
                    </div>

                    <div className="accordion faq-accordion" id="faqAccordion">

                        <div className="accordion-item">
                            <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq1">
                                How long does a project usually take?
                            </button>
                            </h2>
                            <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Project timelines vary based on scope and size, but we always share a clear schedule before starting.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq2">
                                Do you provide turnkey interior solutions?
                            </button>
                            </h2>
                            <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Yes, we offer complete turnkey interior solutions from concept to completion.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq3">
                                Can I customize the design?
                            </button>
                            </h2>
                            <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Absolutely. All designs are fully customizable to suit your preferences and lifestyle.
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header">
                            <button className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#faq4">
                                What is the payment process?
                            </button>
                            </h2>
                            <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                <div className="accordion-body">
                                    Payments are divided into stages and discussed transparently before the project begins.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
        </section>
    </div>
  )
}
