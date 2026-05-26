"use client";

import { useState } from "react";

export default function AddAchievement() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="add-achievement-btn" onClick={() => setIsOpen(true)}>
        + Add Achievement
      </button>

      {isOpen && (
        <div className="video-modal-backdrop achievement-modal-backdrop">
          <div className="video-modal-shell achievement-modal-shell">
            <button className="video-modal-close" onClick={() => setIsOpen(false)}>
              ✕
            </button>
            <div className="achievement-form-container">
              <div className="video-modal-caption">
                <span className="video-modal-eyebrow">Rubenius · Add New</span>
                <h3>Create Achievement</h3>
              </div>
              <form
                className="achievement-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: handle submission logic
                  setIsOpen(false);
                }}
              >
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" name="title" required placeholder="Achievement Title" />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" rows={4} required placeholder="Achievement Description"></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="images">Upload Images</label>
                  <input type="file" id="images" name="images" accept="image/*" multiple />
                </div>
                <div className="form-group">
                  <label htmlFor="video">Upload Video</label>
                  <input type="file" id="video" name="video" accept="video/*" />
                </div>
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setIsOpen(false)}>Cancel</button>
                  <button type="submit" className="submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
