import React from 'react'
import './CVViewer.css'
import cvPdf from '../../images/CV_Tony_Cseresznyak.pdf'

const PDF_URL = cvPdf

function CVViewer() {
  return (
    <div className="cvpdf-root">
      <div className="cvpdf-toolbar">
        <div className="cvpdf-toolbar-left">
          <span className="cvpdf-icon">📄</span>
          <span className="cvpdf-filename">Tony_Cseresznyak_CV.pdf</span>
        </div>
        <div className="cvpdf-toolbar-actions">
          <a
            href={PDF_URL}
            download="Tony_Cseresznyak_CV.pdf"
            className="cvpdf-btn cvpdf-btn-primary"
          >
            ⬇️ Télécharger
          </a>
          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cvpdf-btn"
          >
            ↗ Ouvrir
          </a>
        </div>
      </div>

      <div className="cvpdf-frame-wrap">
        <iframe
          src={`${PDF_URL}#view=FitH&zoom=page-fit`}
          title="CV · Tony Cseresznyak"
          className="cvpdf-frame"
          type="application/pdf"
        />
      </div>
    </div>
  )
}

export default CVViewer
