document.addEventListener("DOMContentLoaded", () => {
    const slotContainer = document.getElementById("slots");
  
    // Create 20 parking slots with unique vehicle images
    for (let i = 1; i <= 20; i++) {
      const slot = document.createElement("div");
      slot.classList.add("slot");
      slot.innerHTML = `
        <img src="https://source.unsplash.com/100x80/?car,parking&sig=${i}" alt="Slot ${i}">
        <div class="slot-number">Slot ${i}</div>
      `;
      slot.dataset.slot = i;
  
      slot.addEventListener("click", () => {
        document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
        slot.classList.add("selected");
      });
  
      slotContainer.appendChild(slot);
    }
  
    document.getElementById("bookBtn").addEventListener("click", () => {
      const selectedSlot = document.querySelector(".slot.selected");
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
  
      if (!selectedSlot || !date || !time) {
        alert("Please select date, time, and a slot.");
        return;
      }
  
      alert(`✅ Slot ${selectedSlot.dataset.slot} successfully booked on ${date} at ${time}!`);
    });
  });
  