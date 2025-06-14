document.addEventListener("DOMContentLoaded", () => {
  // Hamburger menu
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("hidden"));
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Scroll to top
  window.addEventListener("scroll", function () {
    const scrollButton = document.getElementById("scroll-to-top");
    if (scrollButton) {
      scrollButton.classList.toggle("hidden", window.scrollY <= 300);
    }
  });

  // =============================
  // WYSZUKIWARKA POŁĄCZEŃ
  // =============================

  const routes = {
    "krakow-berlin": {
      stops: ["Kraków", "Katowice", "Wrocław", "Berlin"],
      times: ["09:15", "12:50", "15:30"],
      duration: [0, 90, 120, 240] // czas od startu (minuty)
    },
    "rzeszow-wieden": {
      stops: ["Rzeszów", "Tarnów", "Kraków", "Wiedeń"],
      times: ["07:00", "10:30", "14:00"],
      duration: [0, 60, 140, 270]
    },
    "warszawa-praga": {
      stops: ["Warszawa", "Łódź", "Wrocław", "Praga"],
      times: ["06:00", "11:00", "15:45"],
      duration: [0, 90, 240, 330]
    }
  };

  const routeSelect = document.getElementById("route");
  const fromSelect = document.getElementById("from");
  const toSelect = document.getElementById("to");
  const timeSelect = document.getElementById("departure-time");
  const arrivalOutput = document.getElementById("arrival-time");
  const courseType = document.getElementById("course-type");
  const form = document.getElementById("search-form");

  routeSelect?.addEventListener("change", () => {
    const selectedRoute = routes[routeSelect.value];
    resetSelect(fromSelect, "-- Wybierz --");
    resetSelect(toSelect, "-- Wybierz --");
    fromSelect.disabled = !selectedRoute;
    toSelect.disabled = true;
    timeSelect.innerHTML = '<option value="">-- Wybierz godzinę --</option>';
    arrivalOutput.value = "-";
    courseType.value = "-";

    if (selectedRoute) {
      selectedRoute.stops.forEach((stop, idx) => {
        const option = new Option(stop, idx);
        fromSelect.appendChild(option);
      });

      timeSelect.innerHTML = '<option value="">-- Wybierz godzinę --</option>';
      selectedRoute.times.forEach(t => {
        const option = new Option(t, t);
        timeSelect.appendChild(option);
      });
    }
  });

  fromSelect?.addEventListener("change", () => {
    const selectedRoute = routes[routeSelect.value];
    const startIdx = parseInt(fromSelect.value);
    resetSelect(toSelect, "-- Wybierz --");
    toSelect.disabled = false;

    selectedRoute.stops.forEach((stop, idx) => {
      if (idx > startIdx) {
        const option = new Option(stop, idx);
        toSelect.appendChild(option);
      }
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const route = routes[routeSelect.value];
    const fromIdx = parseInt(fromSelect.value);
    const toIdx = parseInt(toSelect.value);
    const departure = timeSelect.value;

    if (!route || isNaN(fromIdx) || isNaN(toIdx) || !departure) {
      alert("Proszę uzupełnić wszystkie pola!");
      return;
    }

    const depTimeParts = departure.split(":");
    const depMinutes = parseInt(depTimeParts[0]) * 60 + parseInt(depTimeParts[1]);
    const travelTime = route.duration[toIdx] - route.duration[fromIdx];
    const arrivalMinutes = depMinutes + travelTime;
    const arrivalHour = String(Math.floor(arrivalMinutes / 60)).padStart(2, "0");
    const arrivalMin = String(arrivalMinutes % 60).padStart(2, "0");

    arrivalOutput.value = `${arrivalHour}:${arrivalMin}`;
    courseType.value = "D – kursuje od poniedziałku do piątku oprócz świąt";
  });

  function resetSelect(selectEl, placeholder) {
    selectEl.innerHTML = "";
    selectEl.appendChild(new Option(placeholder, ""));
  }
});
