import React from 'react'
import "./ProjectHow.css"

export default function ProjectHow() {
  return (
    <div>
        <section className="how-we-work py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">How We Work</h2>
                        <p className="text-muted">Our step-by-step process ensures clarity, quality, and timely delivery.</p>
                    </div>

                    <div className="row g-4">
                   
                        <div className="col-lg-3 col-md-6">
                            <div className="process-card text-center h-100">
                                <span className="step-number">01</span>
                                <h5 className="mt-3">Consultation</h5>
                                <p>Understanding your requirements, space, and lifestyle preferences.</p>
                            </div>
                        </div>

                    
                        <div className="col-lg-3 col-md-6">
                            <div className="process-card text-center h-100">
                                <span className="step-number">02</span>
                                <h5 className="mt-3">Design & Planning</h5>
                                <p>Concept designs, layouts, material selection, and budget planning.</p>
                            </div>
                        </div>

                    
                        <div className="col-lg-3 col-md-6">
                            <div className="process-card text-center h-100">
                                <span className="step-number">03</span>
                                <h5 className="mt-3">Execution</h5>
                                <p>On-site execution with quality control and timeline management.</p>
                            </div>
                        </div>

                   
                        <div className="col-lg-3 col-md-6">
                            <div className="process-card text-center h-100">
                                <span className="step-number">04</span>
                                <h5 className="mt-3">Handover</h5>
                                <p>Final inspection, finishing touches, and project handover.</p>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
    </div>
  )
}
