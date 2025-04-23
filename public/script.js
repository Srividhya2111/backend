document.addEventListener("DOMContentLoaded", () => {
  const slotContainer = document.getElementById("slots");
  const slotInfo = document.getElementById("slotInfo");
  const dateInput = document.getElementById("date");
  const dateInfo = document.getElementById("dateInfo");
  const timeInput = document.getElementById("time");
  const timeInfo = document.getElementById("timeInfo");
  const bookBtn = document.getElementById("bookBtn");

  const slotImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReTk_uDbxmYnTWlVSKcJHWyqyzLLUjZS1d1g&s",
    "https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24641249/GettyImages_1354859135__1_.jpg?quality=90&strip=all&crop=0.036603221083453%2C0%2C99.926793557833%2C100&w=2400",
    "https://www.oobeo.com/wp-content/uploads/2023/10/john-matychuk-yvfp5YHWGsc-unsplash-scaled.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiyXhrPPsLziNQu-KUF0sINJnKcw_Uocw6ng&sk",
    "https://safestart.com/wp-content/uploads/2016/03/backed_in-780x517.jpg",
    "https://www.bashyamgroup.com/static/c4b79cfc67e10134b5ffee1486059545/14b42/planning-for-your-vehicle-parking.jpg",
    "https://img.staticmb.com/mbcontent/images/crop/uploads/2022/8/Laws-and-Parking-Rules-in-Residential-Areas-India_0_1200.jpg",
    "https://thumbs.dreamstime.com/b/empty-car-parking-cars-spaces-sidewalk-pedestrians-flower-bed-d-render-153915727.jpg",
    "https://5.imimg.com/data5/SELLER/Default/2024/9/451614922/OO/OB/TS/13726342/car-parking-slot-marking-service.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnoDuaCtvWKZOlFwb3FEy2KUJrcsLHNmIBEg&s",
  ];

  let selectedSlot = null;
  let bookedSlots = new Set();

  // Fetch booked slots from backend for selected date and time
  async function fetchBookedSlots(date, time) {
    try {
      const response = await fetch(`/get-bookings?date=${date}&time=${time}`);
      const bookings = await response.json();
      bookedSlots.clear();
      bookings.forEach(booking => {
        bookedSlots.add(booking.slotId);
      });
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    }
  }

  // Create slots and mark booked slots
  function createSlots() {
    slotContainer.innerHTML = ""; // Clear existing slots
    for (let i = 1; i <= 20; i++) {
      const slot = document.createElement("div");
      slot.classList.add("slot");
      slot.dataset.slotNumber = i;

      const imgSrc = slotImages[i % slotImages.length];

      slot.innerHTML = `
        <img src="${imgSrc}" alt="Slot ${i}">
        <p>Slot ${i}</p>
      `;

      if (bookedSlots.has(i)) {
        slot.classList.add("booked");
      } else {
        slot.addEventListener("click", () => {
          document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
          slot.classList.add("selected");
          selectedSlot = i;
          slotInfo.textContent = `Selected Slot: Slot ${i}`;
        });
      }

      slotContainer.appendChild(slot);
    }
  }

  // Update booking details display
  function updateBookingDetails() {
    slotInfo.textContent = selectedSlot ? `Selected Slot: Slot ${selectedSlot}` : "No slot selected yet.";
    dateInfo.textContent = dateInput.value ? `Selected Date: ${dateInput.value}` : "No date selected.";
    timeInfo.textContent = timeInput.value ? `Selected Time: ${timeInput.value}` : "No time selected.";
  }

  // Book button click handler
  bookBtn.addEventListener("click", async () => {
    const date = dateInput.value;
    const time = timeInput.value;

    if (!date || !time || !selectedSlot) {
      alert("Please select date, time, and a slot!");
      return;
    }

    const bookingTime = date + " " + time;

    try {
      const response = await fetch('/api/book-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: selectedSlot, bookingTime })
      });

      if (response.ok) {
        alert(`Booking confirmed for Slot ${selectedSlot} on ${date} at ${time}`);
        bookedSlots.add(selectedSlot);
        // Update UI
        createSlots();
        selectedSlot = null;
        updateBookingDetails();
      } else {
        const errorData = await response.json();
        alert("Error booking slot: " + errorData.message);
      }
    } catch (error) {
      alert("Error booking slot: " + error.message);
    }
  });

  // Event listeners for date and time changes to refetch booked slots
  dateInput.addEventListener("change", async () => {
    selectedSlot = null;
    updateBookingDetails();
    if (dateInput.value && timeInput.value) {
      await fetchBookedSlots(dateInput.value, timeInput.value);
      createSlots();
    }
  });

  timeInput.addEventListener("change", async () => {
    selectedSlot = null;
    updateBookingDetails();
    if (dateInput.value && timeInput.value) {
      await fetchBookedSlots(dateInput.value, timeInput.value);
      createSlots();
    }
  });

  // Initialize
  (async () => {
    updateBookingDetails();
    if (dateInput.value && timeInput.value) {
      await fetchBookedSlots(dateInput.value, timeInput.value);
    }
    createSlots();
  })();
});
