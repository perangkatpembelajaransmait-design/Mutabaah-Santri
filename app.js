/* =====================================================
   MUTABAAH SANTRI
   JavaScript + Supabase
===================================================== */
 
 
/* =====================================================
   1. KONFIGURASI SUPABASE
===================================================== */
 
const SUPABASE_URL =
  "https://nltcnawdkdfqfyxddskx.supabase.co";
 
const SUPABASE_KEY =
  "sb_publishable_6NrvcZjJ0OORVHmrhKa4xQ_m6Ch6FXh";
 
 
/* =====================================================
   2. INISIALISASI SUPABASE
===================================================== */
 
let supabaseClient = null;
 
if (
  window.supabase &&
  SUPABASE_URL &&
  SUPABASE_KEY &&
  !SUPABASE_KEY.includes("MASUKKAN")
) {
  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
}
 
 
/* =====================================================
   3. STATE APLIKASI
===================================================== */
 
let currentUser = null;
let currentProfile = null;
 
let currentPage = "dashboard";
 
let studentList = [];
let historyList = [];
 
let quranActiveTab = "ringkasan";
let quranSelectedStudent = "";
 
 
/* =====================================================
   4. ELEMENT HTML
===================================================== */
 
const loadingView =
  document.getElementById("loadingView");
 
const authView =
  document.getElementById("authView");
 
const appView =
  document.getElementById("appView");
 
const loginForm =
  document.getElementById("loginForm");
 
const registerForm =
  document.getElementById("registerForm");
 
const loginButton =
  document.getElementById("loginButton");
 
const registerButton =
  document.getElementById("registerButton");
 
const tabLogin =
  document.getElementById("tabLogin");
 
const tabRegister =
  document.getElementById("tabRegister");
 
const authMessage =
  document.getElementById("authMessage");
 
const logoutButton =
  document.getElementById("logoutButton");
 
const pageContent =
  document.getElementById("pageContent");
 
const pageTitle =
  document.getElementById("pageTitle");
 
const pageEyebrow =
  document.getElementById("eyebrow");
 
const userName =
  document.getElementById("userName");
 
const userRole =
  document.getElementById("userRole");
 
const headerUser =
  document.getElementById("headerUser");
 
const avatar =
  document.getElementById("avatar");
 
 
/* =====================================================
   5. UTILITAS
===================================================== */
 
function showMessage(message, success = false) {
 
  authMessage.textContent = message;
 
  authMessage.classList.toggle(
    "success",
    success
  );
 
}
 
 
function showLoading() {
 
  loadingView.classList.remove("hidden");
 
  authView.classList.add("hidden");
 
  appView.classList.add("hidden");
 
}
 
 
function showAuth() {
 
  loadingView.classList.add("hidden");
 
  authView.classList.remove("hidden");
 
  appView.classList.add("hidden");
 
}
 
 
function showApp() {
 
  loadingView.classList.add("hidden");
 
  authView.classList.add("hidden");
 
  appView.classList.remove("hidden");
 
}
 
 
function escapeHTML(value) {
 
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
 
}
 
 
function todayDate() {
 
  const now = new Date();
 
  const year = now.getFullYear();
 
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");
 
  const day = String(
    now.getDate()
  ).padStart(2, "0");
 
  return `${year}-${month}-${day}`;
 
}
 
 
function formatDate(dateString) {
 
  if (!dateString) return "-";
 
  const date = new Date(
    dateString + "T00:00:00"
  );
 
  return date.toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );
 
}
 
 
function roleLabel(role) {
 
  const labels = {
    "Admin": "Administrator",
    "Guru": "Guru",
    "Orang Tua": "Orang Tua",
    "Santri": "Santri"
  };
 
  return labels[role] || role || "Pengguna";
 
}
 
 
/* =====================================================
   6. CEK KONFIGURASI
===================================================== */
 
function checkConfiguration() {
 
  if (!window.supabase) {
 
    showAuth();
 
    showMessage(
      "Library Supabase belum berhasil dimuat. Periksa koneksi internet."
    );
 
    return false;
 
  }
 
  if (
    !SUPABASE_URL ||
    !SUPABASE_KEY ||
    SUPABASE_KEY.includes("MASUKKAN")
  ) {
 
    showAuth();
 
    showMessage(
      "Masukkan publishable key Supabase pada app.js terlebih dahulu."
    );
 
    return false;
 
  }
 
  return true;
 
}
 
 
/* =====================================================
   7. TAB LOGIN DAN REGISTER
===================================================== */
 
function showLoginTab() {
 
  loginForm.classList.remove("hidden");
 
  registerForm.classList.add("hidden");
 
  tabLogin.classList.add("active");
 
  tabRegister.classList.remove("active");
 
  showMessage("");
 
}
 
 
function showRegisterTab() {
 
  loginForm.classList.add("hidden");
 
  registerForm.classList.remove("hidden");
 
  tabLogin.classList.remove("active");
 
  tabRegister.classList.add("active");
 
  showMessage("");
 
}
 
 
tabLogin.addEventListener(
  "click",
  showLoginTab
);
 
 
tabRegister.addEventListener(
  "click",
  showRegisterTab
);
 
 
/* =====================================================
   8. LOGIN
===================================================== */
 
loginForm.addEventListener(
  "submit",
  async function(event) {
 
    event.preventDefault();
 
    if (!checkConfiguration()) return;
 
    const email =
      document.getElementById("loginEmail")
        .value.trim();
 
    const password =
      document.getElementById("loginPassword")
        .value;
 
    loginButton.disabled = true;
 
    loginButton.textContent = "Memeriksa...";
 
    showMessage("");
 
    try {
 
      const { data, error } =
        await supabaseClient.auth.signInWithPassword({
 
          email: email,
 
          password: password
 
        });
 
      if (error) throw error;
 
      currentUser = data.user;
 
      await loadApplication();
 
    } catch(error) {
 
      console.error("LOGIN ERROR:", error);
 
      showMessage(
        "Login gagal: " + error.message
      );
 
    } finally {
 
      loginButton.disabled = false;
 
      loginButton.textContent = "Masuk";
 
    }
 
  }
);
 
 
/* =====================================================
   9. REGISTER
===================================================== */
 
registerForm.addEventListener(
  "submit",
  async function(event) {
 
    event.preventDefault();
 
    if (!checkConfiguration()) return;
 
    const nama =
      document.getElementById("registerName")
        .value.trim();
 
    const email =
      document.getElementById("registerEmail")
        .value.trim();
 
    const role =
      document.getElementById("registerRole")
        .value;
 
    const password =
      document.getElementById("registerPassword")
        .value;
 
    const confirmPassword =
      document.getElementById("registerConfirm")
        .value;
 
    if (password !== confirmPassword) {
 
      showMessage(
        "Password dan konfirmasi password tidak sama."
      );
 
      return;
 
    }
 
    if (password.length < 6) {
 
      showMessage(
        "Password minimal 6 karakter."
      );
 
      return;
 
    }
 
    const allowedRoles = [
      "Orang Tua",
      "Santri"
    ];
 
    if (!allowedRoles.includes(role)) {
 
      showMessage(
        "Pendaftaran hanya tersedia untuk Orang Tua dan Santri."
      );
 
      return;
 
    }
 
    registerButton.disabled = true;
 
    registerButton.textContent = "Mendaftarkan...";
 
    showMessage("");
 
    try {
 
      const { data, error } =
        await supabaseClient.auth.signUp({
 
          email: email,
 
          password: password,
 
          options: {
 
            data: {
 
              nama: nama,
 
              role: role
 
            }
 
          }
 
        });
 
      if (error) throw error;
 
      if (!data.session) {
 
        showMessage(
          "Akun berhasil dibuat. Silakan periksa email untuk konfirmasi, kemudian login.",
          true
        );
 
        showLoginTab();
 
        document.getElementById(
          "loginEmail"
        ).value = email;
 
        return;
 
      }
 
      currentUser = data.user;
 
      await loadApplication();
 
    } catch(error) {
 
      console.error("REGISTER ERROR:", error);
 
      showMessage(
        "Pendaftaran gagal: " + error.message
      );
 
    } finally {
 
      registerButton.disabled = false;
 
      registerButton.textContent = "Buat akun";
 
    }
 
  }
);
 
 
/* =====================================================
   10. LOGOUT
===================================================== */
 
logoutButton.addEventListener(
  "click",
  async function() {
 
    if (!supabaseClient) return;
 
    logoutButton.disabled = true;
 
    try {
 
      const { error } =
        await supabaseClient.auth.signOut();
 
      if (error) throw error;
 
      currentUser = null;
 
      currentProfile = null;
 
      studentList = [];
 
      historyList = [];
 
      showAuth();
 
      showLoginTab();
 
    } catch(error) {
 
      console.error("LOGOUT ERROR:", error);
 
      alert(
        "Gagal keluar: " + error.message
      );
 
    } finally {
 
      logoutButton.disabled = false;
 
    }
 
  }
);
 
 
/* =====================================================
   11. SESSION SUPABASE
===================================================== */
 
async function checkSession() {
 
  if (!checkConfiguration()) return;
 
  showLoading();
 
  try {
 
    const { data, error } =
      await supabaseClient.auth.getSession();
 
    if (error) throw error;
 
    if (data.session) {
 
      currentUser = data.session.user;
 
      await loadApplication();
 
    } else {
 
      showAuth();
 
      showLoginTab();
 
    }
 
  } catch(error) {
 
    console.error("SESSION ERROR:", error);
 
    showAuth();
 
    showMessage(
      "Tidak dapat memeriksa sesi: " +
      error.message
    );
 
  }
 
}
 
 
/* =====================================================
   12. MEMUAT APLIKASI
===================================================== */
 
async function loadApplication() {
 
  if (!currentUser) {
 
    showAuth();
 
    return;
 
  }
 
  try {
 
    await loadProfile();
 
    showApp();
 
    updateUserInformation();
 
    await renderPage(currentPage);
 
  } catch(error) {
 
    console.error("APPLICATION ERROR:", error);
 
    showAuth();
 
    showMessage(
      "Profil belum dapat dimuat. " +
      error.message
    );
 
  }
 
}
 
 
/* =====================================================
   13. MEMUAT PROFIL
===================================================== */
 
async function loadProfile() {
 
  const { data, error } =
    await supabaseClient
      .from("profiles")
      .select("id,nama,role")
      .eq("id", currentUser.id)
      .maybeSingle();
 
  if (error) throw error;
 
  if (!data) {
 
    throw new Error(
      "Profil pengguna tidak ditemukan. " +
      "Periksa tabel profiles dan kebijakan RLS."
    );
 
  }
 
  currentProfile = data;
 
}
 
 
/* =====================================================
   14. INFORMASI PENGGUNA
===================================================== */
 
function updateUserInformation() {
 
  if (!currentProfile) return;
 
  const nama =
    currentProfile.nama || "Pengguna";
 
  const role =
    currentProfile.role || "Pengguna";
 
  userName.textContent = nama;
 
  userRole.textContent =
    roleLabel(role);
 
  headerUser.textContent =
    nama + " · " + roleLabel(role);
 
  avatar.textContent =
    nama.charAt(0).toUpperCase();
 
}
 
 
/* =====================================================
   15. NAVIGASI
===================================================== */
 
document.querySelectorAll(
  ".nav[data-page]"
).forEach(function(button) {
 
  button.addEventListener(
    "click",
    async function() {
 
      const page =
        button.dataset.page;
 
      currentPage = page;
 
      document.querySelectorAll(
        ".nav[data-page]"
      ).forEach(function(nav) {
 
        nav.classList.toggle(
          "active",
          nav.dataset.page === page
        );
 
      });
 
      await renderPage(page);
 
    }
  );
 
});
 
 
/* =====================================================
   16. RENDER HALAMAN
===================================================== */
 
async function renderPage(page) {
 
  currentPage = page;
 
  pageContent.innerHTML = "";
 
  if (page === "dashboard") {
 
    pageTitle.textContent = "Dashboard";
 
    pageEyebrow.textContent = "RINGKASAN";
 
    await renderDashboard();
 
    return;
 
  }
 
  if (page === "mutabaah") {
 
    pageTitle.textContent = "Mutabaah Harian";
 
    pageEyebrow.textContent = "IBADAH HARIAN";
 
    await renderMutabaah();
 
    return;
 
  }
 
  if (page === "quran") {
 
    pageTitle.textContent = "Al-Qur'an";
 
    pageEyebrow.textContent = "PROGRAM QURAN";
 
    await renderQuran();
 
    return;
 
  }
 
  if (page === "explore") {
 
  pageTitle.textContent = "Eksplor";
 
  pageEyebrow.textContent = "PENGEMBANGAN SANTRI";
 
  await renderExplore();
 
  return;
 
}
 
 
  if (page === "rapor") {
 
    pageTitle.textContent = "Rapor Santri";
 
    pageEyebrow.textContent = "LAPORAN PERKEMBANGAN";
 
    await renderRapor();

    return;
 
  }
 
  if (page === "users") {
 
    pageTitle.textContent = "Pengguna";
 
    pageEyebrow.textContent = "MANAJEMEN PENGGUNA";
 
    if (typeof renderUsers === "function") {
      await renderUsers();
    } else {
      renderComingSoon(
        "Manajemen Pengguna",
        "Tampilan manajemen pengguna belum diimplementasikan. Pengelolaan akun Auth memerlukan kebijakan server-side yang aman dan tidak boleh dilakukan hanya dari browser."
      );
    }
 
    return;
 
  }
 
  renderComingSoon(
    "Halaman tidak ditemukan",
    "Menu yang dipilih belum tersedia."
  );
 
}
 
 
/* =====================================================
   17. DASHBOARD
===================================================== */
 
async function renderDashboard() {
 
  const role =
    currentProfile?.role || "";
 
  let totalSantri = 0;
 
  let totalMutabaah = 0;
 
  try {
 
    const { count, error } =
      await supabaseClient
        .from("santri")
        .select("*", {
          count: "exact",
          head: true
        });
 
    if (error) throw error;
 
    totalSantri = count || 0;
 
  } catch(error) {
 
    console.warn(
      "Jumlah santri belum dapat dimuat:",
      error.message
    );
 
  }
 
  try {
 
    const { count, error } =
      await supabaseClient
        .from("mutabaah_harian")
        .select("*", {
          count: "exact",
          head: true
        })
        .eq("tanggal", todayDate());
 
    if (error) throw error;
 
    totalMutabaah = count || 0;
 
  } catch(error) {
 
    console.warn(
      "Jumlah mutabaah belum dapat dimuat:",
      error.message
    );
 
  }
 
  pageContent.innerHTML = `
 
    <section class="welcome">
 
      <p class="eyebrow">
        MUTABAAH SANTRI
      </p>
 
      <h3>
        Assalamu'alaikum,
        ${escapeHTML(currentProfile.nama)}
      </h3>
 
      <p>
        Selamat datang di sistem pemantauan
        ibadah dan perkembangan santri.
      </p>
 
    </section>
 
    <section class="stats">
 
      <article>
        <small>Total Santri</small>
        <strong>${totalSantri}</strong>
        <span>Data santri terdaftar</span>
      </article>
 
      <article>
        <small>Mutabaah Hari Ini</small>
        <strong>${totalMutabaah}</strong>
        <span>Catatan harian</span>
      </article>
 
      <article>
        <small>Peran Pengguna</small>
        <strong>${escapeHTML(roleLabel(role))}</strong>
        <span>Akses sesuai role</span>
      </article>
 
    </section>
 
    <section class="columns">
 
      <article class="panel">
 
        <h3>Menu Utama</h3>
 
        <button class="quick"
          data-open-page="mutabaah" type="button">
          <span>
            <b>Mutabaah Harian</b>
            <small>Catat ibadah Rumah dan Sekolah</small>
          </span>
          <span class="pill">Buka</span>
        </button>
 
        <button class="quick"
          data-open-page="quran" type="button">
          <span>
            <b>Al-Qur'an</b>
            <small>Target tahfiz dan murojaah</small>
          </span>
          <span class="pill">Buka</span>
        </button>
 
        <button class="quick"
          data-open-page="explore" type="button">
          <span>
            <b>Eksplor</b>
            <small>Perkembangan dan aktivitas santri</small>
          </span>
          <span class="pill">Buka</span>
        </button>
 
      </article>
 
      <article class="panel">
 
        <h3>Informasi</h3>
 
        <div class="row">
          <span>Nama</span>
          <b>${escapeHTML(currentProfile.nama)}</b>
        </div>
 
        <div class="row">
          <span>Role</span>
          <b>${escapeHTML(roleLabel(role))}</b>
        </div>
 
        <div class="row">
          <span>Tanggal</span>
          <b>${formatDate(todayDate())}</b>
        </div>
 
        <div class="notice">
          <b>Catatan</b>
          <span>
            Data mutabaah hanya dapat ditampilkan
            sesuai kebijakan akses akun.
          </span>
        </div>
 
      </article>
 
    </section>
 
  `;
 
  pageContent.querySelectorAll(
    "[data-open-page]"
  ).forEach(function(button) {
 
    button.addEventListener(
      "click",
      async function() {
 
        const page =
          button.dataset.openPage;
 
        document.querySelectorAll(
          ".nav[data-page]"
        ).forEach(function(nav) {
 
          nav.classList.toggle(
            "active",
            nav.dataset.page === page
          );
 
        });
 
        await renderPage(page);
 
      }
    );
 
  });
 
}
 
 
/* =====================================================
   17A. RAPOR PERKEMBANGAN SANTRI
   Periode dipilih manual oleh Admin/Guru.
   Orang Tua hanya melihat santri yang terhubung.
   Santri hanya melihat data dirinya sendiri.
===================================================== */

async function renderRapor() {
  pageContent.innerHTML = `
    <section class="panel">
      <p class="eyebrow">LAPORAN PERKEMBANGAN</p>
      <h3>Menyiapkan Rapor Santri...</h3>
      <p class="muted">Mengambil data sesuai hak akses akun.</p>
    </section>`;

  try {
    await loadStudents();
    const role = currentProfile?.role || "";
    if (!studentList.length) {
      pageContent.innerHTML = `<section class="panel"><h3>Data santri belum terhubung</h3><p class="muted">Akun ini belum memiliki data santri yang dapat ditampilkan.</p></section>`;
      return;
    }

    const canSelect = role === "Admin" || role === "Guru" || role === "Orang Tua";
    const options = studentList.map(s => `<option value="${escapeHTML(s.id)}">${escapeHTML(s.nama)} — ${escapeHTML(s.kelas || "-")}</option>`).join("");
    const studentField = canSelect
      ? `<div><label for="raporStudent">Santri</label><select id="raporStudent">${options}</select></div>`
      : `<div><label>Santri</label><div class="explore-student-fixed">${escapeHTML(studentList[0].nama)} · ${escapeHTML(studentList[0].kelas || "-")}</div><input id="raporStudent" type="hidden" value="${escapeHTML(studentList[0].id)}"></div>`;

    pageContent.innerHTML = `
      <section class="panel no-print">
        <p class="eyebrow">PENGATURAN RAPOR</p>
        <h3>Rapor Perkembangan Santri</h3>
        <p class="muted">Tentukan santri dan periode tanggal khusus untuk menyusun laporan.</p>
        <div class="form-grid">
          ${studentField}
          <div><label for="raporStart">Tanggal awal</label><input id="raporStart" type="date" required></div>
          <div><label for="raporEnd">Tanggal akhir</label><input id="raporEnd" type="date" value="${todayDate()}" required></div>
        </div>
        <div class="form-actions">
          <button class="primary" type="button" id="generateRapor">Tampilkan Rapor</button>
          <button class="secondary" type="button" id="printRapor" disabled>Cetak / Simpan PDF</button>
        </div>
        <p id="raporMessage" class="message" role="status"></p>
      </section>
      <div id="raporResult"></div>`;

    const startInput = document.getElementById("raporStart");
    const endInput = document.getElementById("raporEnd");
    // Periode awal default 30 hari sebelum hari ini; Admin dapat mengubahnya.
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - 29);
    startInput.value = `${defaultStart.getFullYear()}-${String(defaultStart.getMonth()+1).padStart(2,"0")}-${String(defaultStart.getDate()).padStart(2,"0")}`;

    document.getElementById("generateRapor").addEventListener("click", generateRaporReport);
    document.getElementById("raporStudent").addEventListener("change", () => {
      document.getElementById("raporResult").innerHTML = "";
      document.getElementById("printRapor").disabled = true;
    });
    document.getElementById("printRapor").addEventListener("click", () => window.print());
  } catch (error) {
    console.error("RAPOR LOAD ERROR:", error);
    pageContent.innerHTML = `<section class="panel"><h3>Rapor belum dapat dibuka</h3><p class="message">${escapeHTML(error.message)}</p></section>`;
  }
}

async function raporFetchRows(table, studentId, dateColumn, startDate, endDate, columns = "*") {
  let query = supabaseClient.from(table).select(columns).eq("santri_id", studentId);
  if (dateColumn) query = query.gte(dateColumn, startDate).lte(dateColumn, endDate).order(dateColumn, { ascending: true });
  const { data, error } = await query;
  if (error) throw new Error(`Gagal mengambil ${table}: ${error.message}`);
  return data || [];
}

async function generateRaporReport() {
  const button = document.getElementById("generateRapor");
  const message = document.getElementById("raporMessage");
  const result = document.getElementById("raporResult");
  const studentId = document.getElementById("raporStudent")?.value;
  const startDate = document.getElementById("raporStart")?.value;
  const endDate = document.getElementById("raporEnd")?.value;
  const student = studentList.find(s => String(s.id) === String(studentId));

  if (!student) { message.textContent = "Santri tidak ditemukan dalam daftar akun ini."; return; }
  if (!startDate || !endDate) { message.textContent = "Tanggal awal dan akhir wajib diisi."; return; }
  if (startDate > endDate) { message.textContent = "Tanggal awal tidak boleh melewati tanggal akhir."; return; }

  button.disabled = true;
  button.textContent = "Menyusun...";
  message.textContent = "Mengambil data mutabaah, Al-Qur'an, dan Eksplor...";
  result.innerHTML = "";
  document.getElementById("printRapor").disabled = true;

  try {
    const [mutabaah, quranActivity, setoran, murojaah, evaluasi, tahfizTargets, murojaahTargets, skills] = await Promise.all([
      raporFetchRows("mutabaah_harian", studentId, "tanggal", startDate, endDate),
      raporFetchRows("mutabaah_quran", studentId, "tanggal", startDate, endDate),
      raporFetchRows("quran_setoran", studentId, "tanggal", startDate, endDate),
      raporFetchRows("quran_murojaah", studentId, "tanggal", startDate, endDate),
      raporFetchRows("quran_evaluasi_bacaan", studentId, "tanggal_evaluasi", startDate, endDate),
      raporFetchRows("quran_target_tahfiz", studentId, null, startDate, endDate),
      raporFetchRows("quran_target_murojaah", studentId, null, startDate, endDate),
      supabaseClient.from("mastery_skills").select("id,nama_skill,ikon,urutan").eq("aktif", true).order("urutan")
    ]);
    if (skills.error) throw new Error(`Gagal mengambil mastery skills: ${skills.error.message}`);

    const validSetoran = setoran.filter(x => x.status === "valid");
    const totalJuz = validSetoran.reduce((sum, x) => sum + Number(x.jumlah_juz || 0), 0);
    const totalMurojaah = murojaah.reduce((sum, x) => sum + Number(x.jumlah_sesi || 0), 0);
    const latestEval = evaluasi[evaluasi.length - 1];
    const evalLabels = ["makhraj", "tajwid", "kelancaran", "panjang_pendek"];
    const evalAverage = latestEval ? (evalLabels.reduce((sum, k) => sum + Number(latestEval[k] || 0), 0) / 4).toFixed(2) : "—";

    // Target ditampilkan bila rentang masa target beririsan dengan periode rapor.
    const overlaps = item => (!item.periode_mulai || item.periode_mulai <= endDate) && (!item.periode_selesai || item.periode_selesai >= startDate);
    const activeTahfizTargets = tahfizTargets.filter(overlaps);
    const activeMurojaahTargets = murojaahTargets.filter(overlaps);

    const { data: periods, error: periodError } = await supabaseClient
      .from("explore_periods")
      .select("id,skill_id,status,tanggal_mulai,tanggal_selesai,alasan_memilih,tujuan_pengembangan,hasil_akhir")
      .eq("santri_id", studentId);
    if (periodError) throw new Error(`Gagal mengambil periode Eksplor: ${periodError.message}`);
    const relevantPeriods = (periods || []).filter(p =>
      (!p.tanggal_mulai || p.tanggal_mulai <= endDate) && (!p.tanggal_selesai || p.tanggal_selesai >= startDate)
    );
    let assessments = [];
    if (relevantPeriods.length) {
      const { data, error } = await supabaseClient.from("explore_assessments")
        .select("id,period_id,tanggal_penilaian,nilai,tingkat_penguasaan,deskripsi_perkembangan,kekuatan,aspek_perbaikan,rekomendasi,portofolio_url")
        .in("period_id", relevantPeriods.map(p => p.id))
        .gte("tanggal_penilaian", startDate).lte("tanggal_penilaian", endDate)
        .order("tanggal_penilaian", { ascending: true });
      if (error) throw new Error(`Gagal mengambil penilaian Eksplor: ${error.message}`);
      assessments = data || [];
    }

    const skillMap = new Map((skills.data || []).map(x => [String(x.id), x]));
    const fmt = value => value === null || value === undefined || value === "" ? "—" : escapeHTML(value);
    const date = value => value ? formatDate(value) : "—";
    const tableRows = (rows, render, empty) => rows.length
      ? `<div class="table-wrap"><table class="rapor-table"><tbody>${rows.map(render).join("")}</tbody></table></div>`
      : `<p class="muted">${empty}</p>`;
    const homeRows = mutabaah.filter(x => x.jenis_mutabaah === "rumah");
    const schoolRows = mutabaah.filter(x => x.jenis_mutabaah === "sekolah");
    const activityCount = key => mutabaah.filter(x => x[key] === true).length;
    const prayerCount = prayer => mutabaah.filter(x => x.shalat_fardu && x.shalat_fardu[prayer]).length;
    const prayerNames = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
    const prayerSummary = prayerNames.map(p => `<tr><th>${p}</th><td>${prayerCount(p)} catatan terisi</td></tr>`).join("");
    const periodCards = relevantPeriods.map(p => {
      const skill = skillMap.get(String(p.skill_id));
      const related = assessments.filter(a => String(a.period_id) === String(p.id));
      return `<article class="rapor-item"><h4>${fmt(skill?.nama_skill || "Mastery Skill")}</h4><p><b>Status:</b> ${fmt(p.status)} · <b>Periode:</b> ${date(p.tanggal_mulai)} – ${date(p.tanggal_selesai)}</p>${p.tujuan_pengembangan ? `<p><b>Tujuan:</b> ${fmt(p.tujuan_pengembangan)}</p>` : ""}${p.hasil_akhir ? `<p><b>Hasil akhir:</b> ${fmt(p.hasil_akhir)}</p>` : ""}${related.length ? related.map(a => `<div class="rapor-assessment"><b>${date(a.tanggal_penilaian)}</b> · Nilai: ${fmt(a.nilai)} · ${fmt(a.tingkat_penguasaan)}<p>${fmt(a.deskripsi_perkembangan)}</p>${a.kekuatan ? `<p><b>Kekuatan:</b> ${fmt(a.kekuatan)}</p>` : ""}${a.aspek_perbaikan ? `<p><b>Aspek perbaikan:</b> ${fmt(a.aspek_perbaikan)}</p>` : ""}${a.rekomendasi ? `<p><b>Rekomendasi:</b> ${fmt(a.rekomendasi)}</p>` : ""}</div>`).join("") : `<p class="muted">Belum ada penilaian dalam periode rapor.</p>`}</article>`;
    }).join("");

    result.innerHTML = `
      <section class="panel rapor-document" id="raporDocument">
        <header class="rapor-header"><p class="eyebrow">LAPORAN PERKEMBANGAN SANTRI</p><h2>Rapor Santri</h2><p>Periode ${date(startDate)} sampai ${date(endDate)}</p></header>
        <section class="rapor-section"><h3>1. Identitas Santri</h3><div class="rapor-identity"><div><small>Nama</small><b>${fmt(student.nama)}</b></div><div><small>NIS</small><b>${fmt(student.nis)}</b></div><div><small>Kelas</small><b>${fmt(student.kelas)}</b></div><div><small>Jenis Kelamin</small><b>${fmt(student.jenis_kelamin)}</b></div></div></section>
        <section class="rapor-section"><h3>2. Mutabaah Harian</h3><div class="rapor-stats"><div><b>${mutabaah.length}</b><span>Total catatan</span></div><div><b>${homeRows.length}</b><span>Mutabaah Rumah</span></div><div><b>${schoolRows.length}</b><span>Mutabaah Sekolah</span></div></div><h4>Ringkasan Shalat Fardu</h4><table class="rapor-table"><tbody>${prayerSummary}</tbody></table><h4>Pembiasaan dan Aktivitas</h4><table class="rapor-table"><tbody><tr><th>Tahajud</th><td>${activityCount("shalat_tahajud")} catatan</td></tr><tr><th>Dhuha</th><td>${activityCount("shalat_dhuha")} catatan</td></tr><tr><th>Witir</th><td>${activityCount("shalat_witir")} catatan</td></tr><tr><th>Puasa Senin</th><td>${activityCount("puasa_senin")} catatan</td></tr><tr><th>Puasa Kamis</th><td>${activityCount("puasa_kamis")} catatan</td></tr><tr><th>Literasi</th><td>${mutabaah.filter(x => x.literasi).length} catatan</td></tr></tbody></table><h4>Catatan Mutabaah</h4>${tableRows(mutabaah.filter(x => x.catatan || x.kebersihan_diri_keterangan || x.literasi_judul), x => `<tr><th>${date(x.tanggal)} · ${fmt(x.jenis_mutabaah)}</th><td>${x.literasi_judul ? `<b>Buku:</b> ${fmt(x.literasi_judul)} (${fmt(x.literasi_halaman)} halaman)<br>` : ""}${x.kebersihan_diri_keterangan ? `<b>Kebersihan:</b> ${fmt(x.kebersihan_diri_keterangan)}<br>` : ""}${fmt(x.catatan)}</td></tr>`, "Belum ada catatan tambahan pada periode ini.")}</section>
        <section class="rapor-section"><h3>3. Perkembangan Al-Qur'an</h3><div class="rapor-stats"><div><b>${quranActivity.length}</b><span>Aktivitas mutabaah</span></div><div><b>${totalJuz.toFixed(2)}</b><span>Juz setoran valid</span></div><div><b>${totalMurojaah}</b><span>Sesi murojaah</span></div><div><b>${evalAverage}</b><span>Rata-rata evaluasi terbaru (skala 1–4)</span></div></div><h4>Target Tahfiz yang Beririsan dengan Periode</h4>${tableRows(activeTahfizTargets, x => `<tr><th>${fmt(x.program || "Target Tahfiz")}</th><td>${date(x.periode_mulai)} – ${date(x.periode_selesai)} · Target ${fmt(x.target_juz)} juz · ${fmt(x.catatan)}</td></tr>`, "Tidak ada target tahfiz yang tercatat pada rentang periode ini.")}<h4>Setoran Al-Qur'an</h4>${tableRows(validSetoran, x => `<tr><th>${date(x.tanggal)}</th><td>${fmt(x.surah_awal)} ayat ${fmt(x.ayat_awal)} – ${fmt(x.surah_akhir)} ayat ${fmt(x.ayat_akhir)} · ${fmt(x.jumlah_juz)} juz</td></tr>`, "Belum ada setoran berstatus valid pada periode ini.")}<h4>Murojaah</h4>${tableRows(murojaah, x => `<tr><th>${date(x.tanggal)}</th><td>${fmt(x.jumlah_sesi)} sesi · ${fmt(x.materi)} · ${fmt(x.catatan)}</td></tr>`, "Belum ada catatan murojaah pada periode ini.")}<h4>Target Murojaah yang Beririsan dengan Periode</h4>${tableRows(activeMurojaahTargets, x => `<tr><th>${date(x.periode_mulai)} – ${date(x.periode_selesai)}</th><td>Target ${fmt(x.target_sesi)} sesi · ${fmt(x.catatan)}</td></tr>`, "Tidak ada target murojaah yang beririsan dengan periode ini.")}<h4>Evaluasi Bacaan</h4>${tableRows(evaluasi, x => `<tr><th>${date(x.tanggal_evaluasi)}</th><td>Makhraj: ${fmt(x.makhraj)} · Tajwid: ${fmt(x.tajwid)} · Kelancaran: ${fmt(x.kelancaran)} · Panjang-pendek: ${fmt(x.panjang_pendek)}<br>${fmt(x.catatan)}</td></tr>`, "Belum ada evaluasi bacaan pada periode ini.")}</section>
        <section class="rapor-section"><h3>4. Eksplor — Mastery Skills</h3>${periodCards || `<p class="muted">Belum ada periode Mastery Skills yang beririsan dengan periode rapor.</p>`}</section>
        <footer class="rapor-footer"><p>Rapor ini disusun berdasarkan data yang tercatat dalam sistem Mutabaah Santri pada periode tersebut.</p><p>Tanggal cetak: ${date(todayDate())}</p></footer>
      </section>`;

    document.getElementById("printRapor").disabled = false;
    message.textContent = "Rapor berhasil disusun.";
    message.classList.add("success");
  } catch (error) {
    console.error("GENERATE RAPOR ERROR:", error);
    message.textContent = `Rapor gagal disusun: ${error.message}`;
  } finally {
    button.disabled = false;
    button.textContent = "Tampilkan Rapor";
  }
}



/* =====================================================
   18. HALAMAN BELUM DIAKTIFKAN
===================================================== */
 
function renderComingSoon(title, description) {
 
  pageContent.innerHTML = `
 
    <section class="panel">
 
      <p class="eyebrow">
        TAHAP PENGEMBANGAN
      </p>
 
      <h3>
        ${escapeHTML(title)}
      </h3>
 
      <p class="muted">
        ${escapeHTML(description)}
      </p>
 
      <button
        class="primary"
        id="backDashboard"
        type="button"
      >
        Kembali ke Dashboard
      </button>
 
    </section>
 
  `;
 
  document.getElementById(
    "backDashboard"
  ).addEventListener(
    "click",
    async function() {
 
      document.querySelectorAll(
        ".nav[data-page]"
      ).forEach(function(nav) {
 
        nav.classList.toggle(
          "active",
          nav.dataset.page === "dashboard"
        );
 
      });
 
      await renderPage("dashboard");
 
    }
  );
 
}
 
/* =====================================================
   19. MEMUAT DATA SANTRI
===================================================== */
 
async function loadStudents() {
 
  const role = currentProfile?.role || "";
 
  // ADMIN DAN GURU
  if (role === "Admin" || role === "Guru") {
 
    const { data, error } =
      await supabaseClient
        .from("santri")
        .select("id,nis,nama,kelas,jenis_kelamin")
        .order("nama");
 
    if (error) throw error;
 
    studentList = data || [];
 
    return studentList;
  }
 
 
  // ORANG TUA
  if (role === "Orang Tua") {
 
    const { data: links, error: linkError } =
      await supabaseClient
        .from("orang_tua_santri")
        .select("santri_id")
        .eq("user_id", currentUser.id);
 
    if (linkError) throw linkError;
 
    const ids = (links || []).map(
      item => item.santri_id
    );
 
    if (!ids.length) {
      studentList = [];
      return studentList;
    }
 
    const { data, error } =
      await supabaseClient
        .from("santri")
        .select("id,nis,nama,kelas,jenis_kelamin")
        .in("id", ids)
        .order("nama");
 
    if (error) throw error;
 
    studentList = data || [];
 
    return studentList;
  }
 
 
  // SANTRI: DATA MILIK SENDIRI
  if (role === "Santri") {
 
    const { data, error } =
      await supabaseClient
        .from("santri")
        .select("id,nis,nama,kelas,jenis_kelamin")
        .eq("user_id", currentUser.id)
        .order("nama");
 
    if (error) throw error;
 
    studentList = data || [];
 
    return studentList;
  }
 
 
  studentList = [];
 
  return studentList;
}
 
 
/* =====================================================
   20. HALAMAN MUTABAAH HARIAN
===================================================== */
 
async function renderMutabaah() {
 
  pageContent.innerHTML = `
    <section class="panel">
      <p class="eyebrow">FORM PENGISIAN</p>
      <h3>Mutabaah Harian</h3>
      <p class="muted">Memuat data santri...</p>
    </section>
  `;
 
  try {
 
    await loadStudents();
 
    const role = currentProfile?.role || "";
 
    if (!studentList.length) {
      pageContent.innerHTML = `
        <section class="panel">
          <h3>Data santri belum terhubung</h3>
          <p class="muted">
            Belum ditemukan data santri yang terhubung dengan akun ini.
          </p>
        </section>
      `;
      return;
    }
 
    const canChooseStudent =
      role === "Admin" || role === "Guru" || role === "Orang Tua";
 
    const studentOptions = studentList.map(student => `
      <option value="${escapeHTML(student.id)}">
        ${escapeHTML(student.nama)} — ${escapeHTML(student.kelas)}
      </option>
    `).join("");
 
    const studentSelect = canChooseStudent
      ? `
        <select id="studentId" required>
          <option value="">Pilih santri</option>
          ${studentOptions}
        </select>
      `
      : `
        <select id="studentId" required>
          ${studentOptions}
        </select>
      `;
 
    pageContent.innerHTML = `
      <section class="panel">
        <p class="eyebrow">FORM PENGISIAN</p>
        <h3>Mutabaah Harian</h3>
        <p class="muted">Pilih santri, tanggal, dan jenis mutabaah. Fitur tambahan tersedia untuk Mutabaah Rumah maupun Sekolah.</p>
 
        <form id="mutabaahForm">
          <div class="form-grid">
            <div>
              <label for="studentId">Santri</label>
              ${studentSelect}
            </div>
            <div>
              <label for="mutabaahDate">Tanggal</label>
              <input id="mutabaahDate" type="date" value="${todayDate()}" required>
            </div>
            <div>
              <label for="mutabaahType">Jenis Mutabaah</label>
              <select id="mutabaahType" required>
                <option value="rumah">Rumah</option>
                <option value="sekolah">Sekolah</option>
              </select>
            </div>
          </div>
 
          <div class="section-title">
            <span>01</span>
            <div><h4>Shalat Fardu</h4><p>Pilih status pelaksanaan setiap shalat.</p></div>
          </div>
          <div class="prayer-list">
            ${createPrayerField("Subuh")}
            ${createPrayerField("Dzuhur")}
            ${createPrayerField("Ashar")}
            ${createPrayerField("Maghrib")}
            ${createPrayerField("Isya")}
          </div>
 
          <div class="section-title">
            <span>02</span>
            <div><h4>Shalat Sunah</h4><p>Centang shalat sunah yang dilaksanakan.</p></div>
          </div>
          <div class="prayer-list">
            <label class="check-field"><input type="checkbox" id="shalatTahajud"> Shalat Tahajud</label>
            <label class="check-field"><input type="checkbox" id="shalatDhuha"> Shalat Dhuha</label>
            <label class="check-field"><input type="checkbox" id="shalatWitir"> Shalat Witir</label>
          </div>
 
          <div class="section-title">
            <span>03</span>
            <div><h4>Puasa Sunah</h4><p>Centang puasa yang dilaksanakan dan isi puasa lainnya bila ada.</p></div>
          </div>
          <div class="prayer-list">
            <label class="check-field"><input type="checkbox" id="puasaSenin"> Puasa Senin</label>
            <label class="check-field"><input type="checkbox" id="puasaKamis"> Puasa Kamis</label>
          </div>
          <div class="form-grid">
            <div>
              <label for="puasaLainnya">Puasa lainnya</label>
              <input id="puasaLainnya" type="text" maxlength="150" placeholder="Contoh: Puasa Ayyamul Bidh">
            </div>
          </div>
 
          <div class="section-title">
            <span>04</span>
            <div><h4>Waktu Tidur</h4><p>Catat waktu mulai tidur malam dan waktu bangun.</p></div>
          </div>
          <div class="form-grid">
            <div>
              <label for="sleepTime">Waktu mulai tidur</label>
              <input id="sleepTime" type="time">
            </div>
            <div>
              <label for="wakeTime">Waktu bangun tidur</label>
              <input id="wakeTime" type="time">
            </div>
          </div>
 
          <div class="section-title">
            <span>05</span>
            <div><h4>Aktivitas Literasi</h4><p>Judul buku akan diingat untuk pengisian berikutnya.</p></div>
          </div>
          <div class="form-grid">
            <div>
              <label for="literasiJudul">Judul buku</label>
              <input id="literasiJudul" type="text" maxlength="250" placeholder="Masukkan judul buku">
              <small id="literasiHint" class="muted">Judul terakhir akan terisi otomatis berdasarkan santri dan jenis mutabaah.</small>
            </div>
            <div>
              <label for="literasiHalaman">Jumlah halaman yang dibaca hari ini</label>
              <input id="literasiHalaman" type="number" min="0" step="1" placeholder="Contoh: 15">
            </div>
          </div>
 
          <div class="section-title">
            <span>06</span>
            <div><h4>Kebersihan Diri</h4><p>Catatan kebersihan dan pembiasaan.</p></div>
          </div>
          <label for="cleanliness">Keterangan kebersihan diri</label>
          <textarea id="cleanliness" rows="3" maxlength="1000" placeholder="Tuliskan keterangan kebersihan diri..."></textarea>
 
          <label for="mutabaahNote">Catatan tambahan</label>
          <textarea id="mutabaahNote" rows="3" maxlength="2000" placeholder="Tuliskan catatan tambahan..."></textarea>
 
          <div class="form-actions">
            <button class="secondary" type="reset">Reset</button>
            <button class="primary" id="saveMutabaah" type="submit">Simpan Mutabaah</button>
          </div>
          <p id="mutabaahMessage" class="message" role="status"></p>
        </form>
      </section>
 
      <section class="panel saved-panel">
        <div class="panel-heading">
          <h3>Riwayat Mutabaah</h3>
          <button class="secondary" id="refreshHistory" type="button">Muat ulang</button>
        </div>
        <div id="historyList" class="history-list">
          <p class="muted">Memuat riwayat...</p>
        </div>
      </section>
    `;
 
    if (!canChooseStudent) {
      document.getElementById("studentId").value = studentList[0].id;
    }
 
    document.getElementById("mutabaahForm")
      .addEventListener("submit", saveMutabaah);
    document.getElementById("refreshHistory")
      .addEventListener("click", loadMutabaahHistory);
 
    document.getElementById("studentId")
      .addEventListener("change", async () => {
        document.getElementById("literasiJudul").value = "";
        await loadLastLiterasiTitle();
        await loadMutabaahHistory();
      });
    document.getElementById("mutabaahDate")
      .addEventListener("change", loadMutabaahHistory);
    document.getElementById("mutabaahType")
      .addEventListener("change", async () => {
        document.getElementById("literasiJudul").value = "";
        await loadLastLiterasiTitle();
        await loadMutabaahHistory();
      });
 
    await loadLastLiterasiTitle();
    await loadMutabaahHistory();
 
  } catch(error) {
    console.error("MUTABAAH LOAD ERROR:", error);
    pageContent.innerHTML = `
      <section class="panel">
        <h3>Mutabaah belum dapat dimuat</h3>
        <p class="message">${escapeHTML(error.message)}</p>
      </section>
    `;
  }
}
 
 
/* =====================================================
   21. FIELD SHALAT
===================================================== */
 
function createPrayerField(name) {
 
  const id = name.toLowerCase();
 
  return `
    <div class="prayer-row">
 
      <strong>${escapeHTML(name)}</strong>
 
      <select
        id="prayer_${id}"
        data-prayer="${escapeHTML(name)}"
      >
 
        <option value="">Belum diisi</option>
        <option value="berjamaah">Berjamaah</option>
        <option value="munfarid">Munfarid</option>
        <option value="awal_waktu">Awal waktu</option>
        <option value="terlambat">Terlambat</option>
        <option value="tidak">Tidak dilaksanakan</option>
 
      </select>
 
    </div>
  `;
 
}
 
 
/* =====================================================
   22. SIMPAN MUTABAAH
===================================================== */
 
async function saveMutabaah(event) {
 
  event.preventDefault();
 
  const button = document.getElementById("saveMutabaah");
  const message = document.getElementById("mutabaahMessage");
  button.disabled = true;
  button.textContent = "Menyimpan...";
  message.textContent = "";
  message.classList.remove("success");
 
  try {
    const santriId = document.getElementById("studentId").value;
    const tanggal = document.getElementById("mutabaahDate").value;
    const jenis = document.getElementById("mutabaahType").value;
 
    if (!santriId) throw new Error("Silakan pilih santri.");
    if (!tanggal) throw new Error("Silakan pilih tanggal mutabaah.");
    if (!jenis) throw new Error("Silakan pilih jenis mutabaah.");
 
    const shalatFardu = {};
    document.querySelectorAll("[data-prayer]").forEach(select => {
      if (select.value) shalatFardu[select.dataset.prayer] = select.value;
    });
 
    const judulBuku = document.getElementById("literasiJudul").value.trim();
    const halamanBuku = document.getElementById("literasiHalaman").value.trim();
    const puasaLainnya = document.getElementById("puasaLainnya").value.trim();
 
    const payload = {
      santri_id: santriId,
      tanggal,
      jenis_mutabaah: jenis,
      pengisi_id: currentUser?.id || null,
      shalat_fardu: shalatFardu,
      shalat_tahajud: document.getElementById("shalatTahajud").checked,
      shalat_dhuha: document.getElementById("shalatDhuha").checked,
      shalat_witir: document.getElementById("shalatWitir").checked,
      puasa_senin: document.getElementById("puasaSenin").checked,
      puasa_kamis: document.getElementById("puasaKamis").checked,
      puasa_lainnya: puasaLainnya || null,
      puasa_sunah: Boolean(
        document.getElementById("puasaSenin").checked ||
        document.getElementById("puasaKamis").checked || puasaLainnya
      ),
      tidur_malam_jam: document.getElementById("sleepTime").value || null,
      waktu_bangun_tidur: document.getElementById("wakeTime").value || null,
      literasi: Boolean(judulBuku || halamanBuku),
      literasi_judul: judulBuku || null,
      literasi_halaman: halamanBuku || null,
      kebersihan_diri_keterangan:
        document.getElementById("cleanliness").value.trim() || null,
      catatan:
        document.getElementById("mutabaahNote").value.trim() || null
    };
 
    const { error } = await supabaseClient
      .from("mutabaah_harian")
      .upsert(payload, {
        onConflict: "santri_id,tanggal,jenis_mutabaah"
      });
 
    if (error) throw error;
 
    message.textContent = "Mutabaah berhasil disimpan.";
    message.classList.add("success");
 
    await loadMutabaahHistory();
    await loadLastLiterasiTitle();
 
  } catch(error) {
    console.error("SAVE MUTABAAH ERROR:", error);
    message.textContent = "Gagal menyimpan: " + error.message;
  } finally {
    button.disabled = false;
    button.textContent = "Simpan Mutabaah";
  }
}
 
 
/* =====================================================
   22A. JUDUL BUKU LITERASI OTOMATIS
===================================================== */
 
async function loadLastLiterasiTitle() {
  const titleInput = document.getElementById("literasiJudul");
  const hint = document.getElementById("literasiHint");
  const santriId = document.getElementById("studentId")?.value;
  const jenis = document.getElementById("mutabaahType")?.value;
 
  if (!titleInput || !santriId || !jenis) return;
 
  try {
    const { data, error } = await supabaseClient
      .from("mutabaah_harian")
      .select("literasi_judul,tanggal")
      .eq("santri_id", santriId)
      .eq("jenis_mutabaah", jenis)
      .not("literasi_judul", "is", null)
      .neq("literasi_judul", "")
      .order("tanggal", { ascending: false })
      .limit(1)
      .maybeSingle();
 
    if (error) throw error;
 
    // Hanya mengisi otomatis bila kolom masih kosong, agar input manual tidak tertimpa.
    if (data?.literasi_judul && !titleInput.value.trim()) {
      titleInput.value = data.literasi_judul;
      if (hint) {
        hint.textContent = "Judul terakhir terisi otomatis. Ganti jika mulai membaca buku baru.";
      }
    } else if (hint && !data?.literasi_judul) {
      hint.textContent = "Belum ada judul buku sebelumnya untuk pilihan ini.";
    }
  } catch(error) {
    console.warn("JUDUL LITERASI OTOMATIS GAGAL DIMUAT:", error.message);
    if (hint) hint.textContent = "Judul buku dapat diisi secara manual.";
  }
}
 
 
/* =====================================================
   23. RIWAYAT MUTABAAH
===================================================== */
 
async function loadMutabaahHistory() {
 
  const container = document.getElementById("historyList");
  if (!container) return;
 
  const santriId = document.getElementById("studentId")?.value;
  const tanggal = document.getElementById("mutabaahDate")?.value;
  const jenis = document.getElementById("mutabaahType")?.value;
 
  if (!santriId) {
    container.innerHTML = `<p class="muted">Pilih santri untuk melihat riwayat.</p>`;
    return;
  }
 
  container.innerHTML = `<p class="muted">Memuat riwayat...</p>`;
 
  try {
    let query = supabaseClient
      .from("mutabaah_harian")
      .select(`
        id, santri_id, tanggal, jenis_mutabaah, shalat_fardu,
        shalat_tahajud, shalat_dhuha, shalat_witir,
        puasa_senin, puasa_kamis, puasa_lainnya,
        tidur_malam_jam, waktu_bangun_tidur,
        literasi, literasi_judul, literasi_halaman,
        kebersihan_diri_keterangan, catatan
      `)
      .eq("santri_id", santriId)
      .order("tanggal", { ascending: false })
      .limit(20);
 
    if (jenis) query = query.eq("jenis_mutabaah", jenis);
    if (tanggal) query = query.lte("tanggal", tanggal);
 
    const { data, error } = await query;
    if (error) throw error;
 
    historyList = data || [];
 
    if (!historyList.length) {
      container.innerHTML = `<p class="muted">Belum ada riwayat mutabaah untuk pilihan ini.</p>`;
      return;
    }
 
    container.innerHTML = historyList.map(item => {
      const prayerCount = Object.keys(item.shalat_fardu || {}).length;
      const sunah = [
        item.shalat_tahajud ? "Tahajud" : null,
        item.shalat_dhuha ? "Dhuha" : null,
        item.shalat_witir ? "Witir" : null
      ].filter(Boolean);
      const puasa = [
        item.puasa_senin ? "Senin" : null,
        item.puasa_kamis ? "Kamis" : null,
        item.puasa_lainnya || null
      ].filter(Boolean);
      const sleep = item.tidur_malam_jam || item.waktu_bangun_tidur
        ? `${item.tidur_malam_jam || "—"} – ${item.waktu_bangun_tidur || "—"}`
        : "Belum diisi";
      const literacy = item.literasi_judul
        ? `${escapeHTML(item.literasi_judul)} (${escapeHTML(item.literasi_halaman || "0")} halaman)`
        : "Belum diisi";
 
      return `
        <article class="history-item">
          <div>
            <strong>${formatDate(item.tanggal)}</strong>
            <small>${escapeHTML(item.jenis_mutabaah)} · ${prayerCount} shalat fardu terisi</small>
            <small>Shalat sunah: ${sunah.length ? escapeHTML(sunah.join(", ")) : "—"}</small>
            <small>Puasa: ${puasa.length ? escapeHTML(puasa.join(", ")) : "—"}</small>
            <small>Waktu tidur: ${escapeHTML(sleep)}</small>
            <small>Literasi: ${literacy}</small>
          </div>
          <span class="pill">Tersimpan</span>
        </article>
      `;
    }).join("");
 
  } catch(error) {
    console.error("HISTORY ERROR:", error);
    container.innerHTML = `
      <p class="message">Riwayat belum dapat dimuat: ${escapeHTML(error.message)}</p>
    `;
  }
}
 
/* =====================================================
   20. MODUL PROGRAM AL-QUR'AN
===================================================== */
 
function quranCanManage() {
  return ["Admin", "Guru"].includes(
    currentProfile?.role || ""
  );
}
 
 
function quranSelectedStudentId() {
 
  const select =
    document.getElementById("quranStudent");
 
  return (
    select?.value ||
    quranSelectedStudent ||
    studentList[0]?.id ||
    ""
  );
 
}
 
 
function quranStudentOptions(selectedId = "") {
 
  return studentList.map(student => `
    <option
      value="${escapeHTML(student.id)}"
      ${student.id === selectedId ? "selected" : ""}
    >
      ${escapeHTML(student.nama)}
      — ${escapeHTML(student.kelas)}
    </option>
  `).join("");
 
}
 
 
function quranStudentSelector(selectedId = "") {
 
  if (studentList.length <= 1) {
 
    return studentList.length
      ? `
        <input
          type="hidden"
          id="quranStudent"
          value="${escapeHTML(studentList[0].id)}"
        >
 
        <div class="quran-student-fixed">
          ${escapeHTML(studentList[0].nama)}
          · ${escapeHTML(studentList[0].kelas)}
        </div>
      `
      : `
        <p class="muted">
          Belum ada data santri yang terhubung.
        </p>
      `;
  }
 
  return `
    <label for="quranStudent">
      Pilih santri
    </label>
 
    <select id="quranStudent">
      <option value="">Pilih santri</option>
      ${quranStudentOptions(selectedId)}
    </select>
  `;
 
}
 
 
function quranTabs() {
 
  const tabs = [
    ["ringkasan", "Ringkasan"],
    ["mutabaah", "Mutabaah Quran"],
    ["target", "Target Tahfiz"],
    ["setoran", "Setoran Hafalan"],
    ["target-murojaah", "Target Murojaah"],
    ["murojaah", "Murojaah"],
    ["evaluasi", "Evaluasi Bacaan"],
    ["rekap", "Rekap Perkembangan"]
  ];
 
  return `
    <div class="quran-tabs" role="tablist">
 
      ${tabs.map(([key, label]) => `
        <button
          type="button"
          class="quran-tab ${
            quranActiveTab === key ? "active" : ""
          }"
          data-quran-tab="${key}"
        >
          ${label}
        </button>
      `).join("")}
 
    </div>
  `;
 
}
 
 
/* =====================================================
   21. HALAMAN UTAMA AL-QUR'AN
===================================================== */
 
async function renderQuran() {
 
  pageContent.innerHTML = `
    <section class="panel">
      <p class="eyebrow">PROGRAM QURAN</p>
      <h3>Memuat program Al-Qur'an...</h3>
      <p class="muted">
        Mengambil data perkembangan santri.
      </p>
    </section>
  `;
 
  try {
 
    await loadStudents();
 
    if (!studentList.length) {
 
      pageContent.innerHTML = `
        <section class="panel">
          <p class="eyebrow">PROGRAM QURAN</p>
          <h3>Data santri belum terhubung</h3>
 
          <p class="muted">
            Akun ini belum memiliki data santri
            yang dapat diakses. Pastikan relasi
            akun Santri atau Orang Tua sudah
            diatur pada database.
          </p>
        </section>
      `;
 
      return;
    }
 
    if (
      !studentList.some(
        student => student.id === quranSelectedStudent
      )
    ) {
      quranSelectedStudent = studentList[0].id;
    }
 
    await renderQuranTab();
 
  } catch(error) {
 
    console.error("QURAN LOAD ERROR:", error);
 
    pageContent.innerHTML = `
      <section class="panel">
        <h3>Halaman Al-Qur'an belum dapat dimuat</h3>
 
        <p class="message">
          ${escapeHTML(error.message)}
        </p>
 
        <p class="hint">
          Periksa hak akses RLS dan relasi akun
          dengan data santri.
        </p>
      </section>
    `;
 
  }
 
}
 
 
/* =====================================================
   22. NAVIGASI TAB AL-QUR'AN
===================================================== */
 
async function renderQuranTab() {
 
  const role =
    currentProfile?.role || "";
 
  const canManage =
    quranCanManage();
 
  const selected =
    quranSelectedStudentId();
 
  pageContent.innerHTML = `
 
    <section class="quran-hero">
 
      <div>
        <p class="eyebrow">
          PEMBINAAN DAN PERKEMBANGAN
        </p>
 
        <h3>Program Al-Qur'an</h3>
 
        <p>
          Pantau target hafalan, setoran,
          murojaah, dan kualitas bacaan santri.
        </p>
      </div>
 
      <div class="quran-hero-mark">
        ۞
      </div>
 
    </section>
 
 
    <section class="panel quran-toolbar">
 
      <div class="quran-toolbar-info">
 
        <span class="quran-role">
          ${escapeHTML(roleLabel(role))}
        </span>
 
        <small>
          ${
            canManage
              ? "Mode pengelolaan data"
              : "Mode pemantauan — hanya dapat melihat data"
          }
        </small>
 
      </div>
 
      ${quranStudentSelector(selected)}
 
    </section>
 
 
    ${quranTabs()}
 
 
    <div
      id="quranTabContent"
      class="quran-tab-content"
    >
      <section class="panel">
        <p class="muted">Memuat data...</p>
      </section>
    </div>
 
  `;
 
 
  document.querySelectorAll(
    "[data-quran-tab]"
  ).forEach(button => {
 
    button.addEventListener(
      "click",
      async () => {
 
        quranActiveTab =
          button.dataset.quranTab;
 
        await renderQuranTab();
 
      }
    );
 
  });
 
 
  const studentSelect =
    document.getElementById("quranStudent");
 
  if (studentSelect) {
 
    studentSelect.addEventListener(
      "change",
      async () => {
 
        quranSelectedStudent =
          studentSelect.value;
 
        await renderQuranTab();
 
      }
    );
 
  }
 
  await loadQuranTabContent();
 
}
 
 
/* =====================================================
   23. FUNGSI MENGAMBIL DATA QURAN
===================================================== */
 
async function quranFetch(
  table,
  columns = "*",
  studentId = quranSelectedStudentId(),
  limit = 100
) {
 
  let query = supabaseClient
    .from(table)
    .select(columns)
    .eq("santri_id", studentId)
    .order("tanggal", {
      ascending: false
    })
    .limit(limit);
 
 
  if (
    table === "quran_target_tahfiz" ||
    table === "quran_target_murojaah"
  ) {
 
    query = supabaseClient
      .from(table)
      .select(columns)
      .eq("santri_id", studentId)
      .order("periode_mulai", {
        ascending: false
      })
      .limit(limit);
 
  }
 
 
  if (table === "quran_evaluasi_bacaan") {
 
    query = supabaseClient
      .from(table)
      .select(columns)
      .eq("santri_id", studentId)
      .order("tanggal_evaluasi", {
        ascending: false
      })
      .limit(limit);
 
  }
 
 
  const { data, error } = await query;
 
  if (error) throw error;
 
  return data || [];
 
}
 
 
function quranNotice(text) {
 
  return `
    <p class="quran-empty">
      ${escapeHTML(text)}
    </p>
  `;
 
}
 
 
function quranFormActions(label = "Simpan data") {
 
  return `
    <div class="form-actions">
 
      <button
        class="primary"
        type="submit"
      >
        ${label}
      </button>
 
    </div>
 
    <p
      class="message"
      id="quranFormMessage"
      role="status"
    ></p>
  `;
 
}
 
 
function quranReadOnlyNotice() {
 
  return `
    <div class="notice quran-readonly">
 
      <b>Mode pemantauan</b>
 
      <span>
        Akun Orang Tua dan Santri hanya dapat
        melihat data. Pengisian dan perubahan
        dilakukan oleh Admin atau Guru.
      </span>
 
    </div>
  `;
 
}
 
 
/* =====================================================
   24. MEMILIH KONTEN TAB QURAN
===================================================== */
 
async function loadQuranTabContent() {
 
  const container =
    document.getElementById("quranTabContent");
 
  if (!container) return;
 
  const studentId =
    quranSelectedStudentId();
 
  if (!studentId) {
 
    container.innerHTML = `
      <section class="panel">
        ${quranNotice("Pilih santri terlebih dahulu.")}
      </section>
    `;
 
    return;
  }
 
  container.innerHTML = `
    <section class="panel">
      <p class="muted">
        Memuat data Al-Qur'an...
      </p>
    </section>
  `;
 
  try {
 
    if (
      quranActiveTab === "ringkasan" ||
      quranActiveTab === "rekap"
    ) {
 
      await renderQuranSummary(
        container,
        studentId,
        quranActiveTab === "rekap"
      );
 
    } else if (quranActiveTab === "mutabaah") {
 
      await renderQuranMutabaah(
        container,
        studentId
      );
 
    } else if (quranActiveTab === "target") {
 
      await renderQuranTarget(
        container,
        studentId
      );
 
    } else if (quranActiveTab === "setoran") {
 
      await renderQuranSetoran(
        container,
        studentId
      );
 
    } else if (
      quranActiveTab === "target-murojaah"
    ) {
 
      await renderQuranTargetMurojaah(
        container,
        studentId
      );
 
    } else if (quranActiveTab === "murojaah") {
 
      await renderQuranMurojaah(
        container,
        studentId
      );
 
    } else if (quranActiveTab === "evaluasi") {
 
      await renderQuranEvaluasi(
        container,
        studentId
      );
 
    }
 
  } catch(error) {
 
    console.error("QURAN TAB ERROR:", error);
 
    container.innerHTML = `
      <section class="panel">
 
        <h3>Data belum dapat ditampilkan</h3>
 
        <p class="message">
          ${escapeHTML(error.message)}
        </p>
 
      </section>
    `;
 
  }
 
}
 
 
/* =====================================================
   25. RINGKASAN PERKEMBANGAN QURAN
===================================================== */
 
async function renderQuranSummary(
  container,
  studentId,
  detailed = false
) {
 
  const [
    mutabaah,
    targets,
    setoran,
    targetMurojaah,
    murojaah,
    evaluasi
  ] = await Promise.all([
 
    quranFetch(
      "mutabaah_quran",
      "id,tanggal,reguler,takhasus,tilawah,catatan",
      studentId
    ),
 
    quranFetch(
      "quran_target_tahfiz",
      "id,program,periode_mulai,periode_selesai,target_juz,catatan",
      studentId
    ),
 
    quranFetch(
      "quran_setoran",
      "id,tanggal,surah_awal,ayat_awal,surah_akhir,ayat_akhir,jumlah_juz,status,catatan",
      studentId
    ),
 
    quranFetch(
      "quran_target_murojaah",
      "id,periode_mulai,periode_selesai,target_sesi,catatan",
      studentId
    ),
 
    quranFetch(
      "quran_murojaah",
      "id,tanggal,jumlah_sesi,materi,catatan",
      studentId
    ),
 
    quranFetch(
      "quran_evaluasi_bacaan",
      "id,tanggal_evaluasi,makhraj,tajwid,kelancaran,panjang_pendek,catatan",
      studentId
    )
 
  ]);
 
 
  const validSetoran =
    setoran.filter(
      item => item.status === "valid"
    );
 
  const totalJuz =
    validSetoran.reduce(
      (sum, item) =>
        sum + Number(item.jumlah_juz || 0),
      0
    );
 
  const totalSesi =
    murojaah.reduce(
      (sum, item) =>
        sum + Number(item.jumlah_sesi || 0),
      0
    );
 
  const latestEval =
    evaluasi[0];
 
  const evalAverage = latestEval
    ? (
        (
          latestEval.makhraj +
          latestEval.tajwid +
          latestEval.kelancaran +
          latestEval.panjang_pendek
        ) / 4
      ).toFixed(2)
    : "—";
 
 
  const metricCards = `
 
    <div class="quran-metrics">
 
      <article>
        <small>Aktivitas mutabaah</small>
        <strong>${mutabaah.length}</strong>
        <span>catatan tersimpan</span>
      </article>
 
      <article>
        <small>Target tahfiz</small>
        <strong>${targets.length}</strong>
        <span>program tercatat</span>
      </article>
 
      <article>
        <small>Setoran valid</small>
        <strong>${validSetoran.length}</strong>
        <span>
          ${totalJuz.toLocaleString("id-ID")}
          juz disahkan
        </span>
      </article>
 
      <article>
        <small>Murojaah</small>
        <strong>${totalSesi}</strong>
        <span>total sesi tercatat</span>
      </article>
 
    </div>
 
  `;
 
 
  const recentSetoran =
    setoran.slice(0, 5).map(item => `
 
      <div class="quran-list-row">
 
        <div>
 
          <b>
            ${escapeHTML(
              item.surah_awal || "Surah belum diisi"
            )}
 
            ${
              item.ayat_awal
                ? `: ${item.ayat_awal}`
                : ""
            }
          </b>
 
          <small>
            ${formatDate(item.tanggal)}
            · ${Number(item.jumlah_juz || 0)} juz
          </small>
 
        </div>
 
        <span class="quran-status ${item.status}">
          ${escapeHTML(item.status)}
        </span>
 
      </div>
 
    `).join("");
 
 
  container.innerHTML = `
 
    <section class="panel">
 
      <div class="panel-heading">
 
        <div>
 
          <p class="eyebrow">DASHBOARD QURAN</p>
 
          <h3>
            ${
              detailed
                ? "Rekap Perkembangan Al-Qur'an"
                : "Ringkasan Perkembangan"
            }
          </h3>
 
        </div>
 
        <span class="quran-status valid">
          Data terbaru
        </span>
 
      </div>
 
      ${metricCards}
 
      <div class="quran-summary-grid">
 
        <div class="quran-summary-card">
          <small>Target murojaah</small>
          <strong>${targetMurojaah.length}</strong>
          <span>periode tercatat</span>
        </div>
 
        <div class="quran-summary-card">
          <small>Evaluasi bacaan terakhir</small>
          <strong>${evalAverage}</strong>
          <span>rata-rata skala 1–4</span>
        </div>
 
        <div class="quran-summary-card">
          <small>Catatan murojaah</small>
          <strong>${murojaah.length}</strong>
          <span>riwayat kegiatan</span>
        </div>
 
      </div>
 
    </section>
 
 
    <section class="panel saved-panel">
 
      <div class="panel-heading">
 
        <h3>Setoran Hafalan Terbaru</h3>
 
        <button
          type="button"
          class="secondary"
          data-quran-go="setoran"
        >
          Lihat semua
        </button>
 
      </div>
 
      ${
        recentSetoran ||
        quranNotice(
          "Belum ada setoran hafalan yang tercatat."
        )
      }
 
    </section>
 
 
    ${
      detailed
        ? `
 
          <section class="panel saved-panel">
 
            <h3>Ringkasan target tahfiz</h3>
 
            ${
              targets.length
                ? targets.map(t => `
 
                    <div class="quran-list-row">
 
                      <div>
                        <b>${escapeHTML(t.program)}</b>
 
                        <small>
                          ${formatDate(t.periode_mulai)}
                          –
                          ${formatDate(t.periode_selesai)}
                        </small>
                      </div>
 
                      <strong>
                        ${Number(t.target_juz)} juz
                      </strong>
 
                    </div>
 
                  `).join("")
                : quranNotice("Belum ada target tahfiz.")
            }
 
          </section>
 
 
          <section class="panel saved-panel">
 
            <h3>Evaluasi bacaan terakhir</h3>
 
            ${
              latestEval
                ? `
 
                  <div class="quran-score-grid">
 
                    ${quranScore(
                      "Makhraj",
                      latestEval.makhraj
                    )}
 
                    ${quranScore(
                      "Tajwid",
                      latestEval.tajwid
                    )}
 
                    ${quranScore(
                      "Kelancaran",
                      latestEval.kelancaran
                    )}
 
                    ${quranScore(
                      "Panjang-pendek",
                      latestEval.panjang_pendek
                    )}
 
                  </div>
 
                  <p class="muted">
                    ${escapeHTML(
                      latestEval.catatan ||
                      "Tidak ada catatan tambahan."
                    )}
                  </p>
 
                `
                : quranNotice(
                    "Belum ada evaluasi bacaan."
                  )
            }
 
          </section>
 
        `
        : ""
    }
 
  `;
 
 
  container.querySelectorAll(
    "[data-quran-go]"
  ).forEach(button => {
 
    button.addEventListener(
      "click",
      async () => {
 
        quranActiveTab =
          button.dataset.quranGo;
 
        await renderQuranTab();
 
      }
    );
 
  });
 
}
 
 
function quranScore(label, score) {
 
  const names = {
    1: "Perlu bimbingan",
    2: "Cukup",
    3: "Baik",
    4: "Sangat baik"
  };
 
  return `
    <div class="quran-score">
 
      <small>${label}</small>
 
      <strong>${score}/4</strong>
 
      <span>
        ${names[score] || "—"}
      </span>
 
    </div>
  `;
 
}
 
 
/* =====================================================
   26. MUTABAAH QURAN HARIAN
===================================================== */
 
async function renderQuranMutabaah(
  container,
  studentId
) {
 
  const rows = await quranFetch(
    "mutabaah_quran",
    "id,tanggal,reguler,takhasus,tilawah,catatan",
    studentId
  );
 
  container.innerHTML = `
 
    ${
      quranCanManage()
        ? `
 
          <section class="panel">
 
            <p class="eyebrow">FORM PENGISIAN</p>
 
            <h3>Mutabaah Quran Harian</h3>
 
            <form id="quranMutabaahForm">
 
              <div class="form-grid">
 
                <div>
 
                  <label for="qmDate">
                    Tanggal
                  </label>
 
                  <input
                    id="qmDate"
                    type="date"
                    value="${todayDate()}"
                    required
                  >
 
                </div>
 
              </div>
 
 
              <div class="quran-check-grid">
 
                <label>
                  <input
                    type="checkbox"
                    id="qmReguler"
                  >
                  Program Reguler
                </label>
 
                <label>
                  <input
                    type="checkbox"
                    id="qmTakhasus"
                  >
                  Program Takhasus
                </label>
 
                <label>
                  <input
                    type="checkbox"
                    id="qmTilawah"
                  >
                  Tilawah
                </label>
 
              </div>
 
 
              <label for="qmNote">
                Catatan
              </label>
 
              <textarea
                id="qmNote"
                rows="2"
                maxlength="1000"
              ></textarea>
 
              ${quranFormActions("Simpan Mutabaah")}
 
            </form>
 
          </section>
 
        `
        : quranReadOnlyNotice()
    }
 
 
    <section class="panel saved-panel">
 
      <h3>Riwayat Mutabaah Quran</h3>
 
      ${
        rows.length
          ? rows.map(r => `
 
              <div class="quran-list-row">
 
                <div>
 
                  <b>${formatDate(r.tanggal)}</b>
 
                  <small>
 
                    ${
                      [
                        r.reguler && "Reguler",
                        r.takhasus && "Takhasus",
                        r.tilawah && "Tilawah"
                      ]
                        .filter(Boolean)
                        .join(" · ") ||
                      "Belum ada aktivitas"
                    }
 
                    ${
                      r.catatan
                        ? " · " + escapeHTML(r.catatan)
                        : ""
                    }
 
                  </small>
 
                </div>
 
              </div>
 
            `).join("")
          : quranNotice("Belum ada mutabaah Quran.")
      }
 
    </section>
 
  `;
 
 
  const form =
    document.getElementById("quranMutabaahForm");
 
  if (form) {
 
    form.addEventListener(
      "submit",
      async event => {
 
        event.preventDefault();
 
        await quranSubmit(
          form,
          "quranFormMessage",
          async () => {
 
            const { error } =
              await supabaseClient
                .from("mutabaah_quran")
                .insert({
 
                  santri_id: studentId,
 
                  tanggal:
                    document.getElementById("qmDate").value,
 
                  reguler:
                    document.getElementById("qmReguler").checked,
 
                  takhasus:
                    document.getElementById("qmTakhasus").checked,
 
                  tilawah:
                    document.getElementById("qmTilawah").checked,
 
                  catatan:
                    document.getElementById("qmNote").value.trim()
                    || null
 
                });
 
            if (error) throw error;
 
          }
        );
 
      }
    );
 
  }
 
}
 
 
/* =====================================================
   27. TARGET TAHFIZ
===================================================== */
 
async function renderQuranTarget(
  container,
  studentId
) {
 
  const rows = await quranFetch(
    "quran_target_tahfiz",
    "id,program,periode_mulai,periode_selesai,target_juz,catatan",
    studentId
  );
 
  container.innerHTML = `
 
    ${
      quranCanManage()
        ? `
 
          <section class="panel">
 
            <p class="eyebrow">
              PERENCANAAN HAFALAN
            </p>
 
            <h3>Buat Target Tahfiz</h3>
 
            <form id="quranTargetForm">
 
              <div class="form-grid">
 
                <div>
 
                  <label for="qtProgram">
                    Program
                  </label>
 
                  <select id="qtProgram">
 
                    <option value="reguler">
                      Reguler
                    </option>
 
                    <option value="takhasus">
                      Takhasus
                    </option>
 
                  </select>
 
                </div>
 
 
                <div>
 
                  <label for="qtJuz">
                    Target (juz)
                  </label>
 
                  <input
                    id="qtJuz"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  >
 
                </div>
 
 
                <div>
 
                  <label for="qtStart">
                    Periode mulai
                  </label>
 
                  <input
                    id="qtStart"
                    type="date"
                    value="${todayDate()}"
                    required
                  >
 
                </div>
 
 
                <div>
 
                  <label for="qtEnd">
                    Periode selesai
                  </label>
 
                  <input
                    id="qtEnd"
                    type="date"
                    required
                  >
 
                </div>
 
              </div>
 
 
              <label for="qtNote">
                Catatan target
              </label>
 
              <textarea
                id="qtNote"
                rows="2"
                maxlength="1000"
              ></textarea>
 
              ${quranFormActions("Simpan Target")}
 
            </form>
 
          </section>
 
        `
        : quranReadOnlyNotice()
    }
 
 
    <section class="panel saved-panel">
 
      <h3>Daftar Target Tahfiz</h3>
 
      ${
        rows.length
          ? rows.map(r => `
 
              <div class="quran-list-row">
 
                <div>
 
                  <b>
                    ${escapeHTML(r.program)}
                    · ${Number(r.target_juz)} juz
                  </b>
 
                  <small>
                    ${formatDate(r.periode_mulai)}
                    –
                    ${formatDate(r.periode_selesai)}
 
                    ${
                      r.catatan
                        ? " · " + escapeHTML(r.catatan)
                        : ""
                    }
                  </small>
 
                </div>
 
              </div>
 
            `).join("")
          : quranNotice("Belum ada target tahfiz.")
      }
 
    </section>
 
  `;
 
 
  const form =
    document.getElementById("quranTargetForm");
 
  if (form) {
 
    form.addEventListener(
      "submit",
      async event => {
 
        event.preventDefault();
 
        await quranSubmit(
          form,
          "quranFormMessage",
          async () => {
 
            const start =
              document.getElementById("qtStart").value;
 
            const end =
              document.getElementById("qtEnd").value;
 
            if (end < start) {
              throw new Error(
                "Tanggal selesai tidak boleh sebelum tanggal mulai."
              );
            }
 
            const { error } =
              await supabaseClient
                .from("quran_target_tahfiz")
                .insert({
 
                  santri_id: studentId,
 
                  program:
                    document.getElementById("qtProgram").value,
 
                  periode_mulai: start,
 
                  periode_selesai: end,
 
                  target_juz:
                    Number(
                      document.getElementById("qtJuz").value
                    ),
 
                  guru_id: currentProfile.id,
 
                  catatan:
                    document.getElementById("qtNote").value.trim()
                    || null
 
                });
 
            if (error) throw error;
 
          }
        );
 
      }
    );
 
  }
 
}
 
 
/* =====================================================
   28. SETORAN HAFALAN
===================================================== */
 
async function renderQuranSetoran(
  container,
  studentId
) {
 
  const [rows, targets] = await Promise.all([
 
    quranFetch(
      "quran_setoran",
      "id,tanggal,surah_awal,ayat_awal,surah_akhir,ayat_akhir,jumlah_juz,status,catatan,target_id",
      studentId
    ),
 
    quranFetch(
      "quran_target_tahfiz",
      "id,program,periode_mulai,periode_selesai,target_juz",
      studentId
    )
 
  ]);
 
 
  container.innerHTML = `
 
    ${
      quranCanManage()
        ? `
 
          <section class="panel">
 
            <p class="eyebrow">
              PENCATATAN HAFALAN
            </p>
 
            <h3>Input Setoran Hafalan</h3>
 
            <form id="quranSetoranForm">
 
              <div class="form-grid">
 
                <div>
 
                  <label for="qsDate">
                    Tanggal
                  </label>
 
                  <input
                    id="qsDate"
                    type="date"
                    value="${todayDate()}"
                    required
                  >
 
                </div>
 
 
                <div>
 
                  <label for="qsTarget">
                    Target tahfiz
                  </label>
 
                  <select id="qsTarget">
 
                    <option value="">
                      Tanpa target
                    </option>
 
                    ${
                      targets.map(t => `
 
                        <option value="${t.id}">
 
                          ${escapeHTML(t.program)}
                          · ${Number(t.target_juz)} juz
                          (${formatDate(t.periode_mulai)})
 
                        </option>
 
                      `).join("")
                    }
 
                  </select>
 
                </div>
 
 
                <div>
 
                  <label for="qsSurahStart">
                    Surah awal
                  </label>
 
                  <input
                    id="qsSurahStart"
                    maxlength="100"
                    required
                  >
 
                </div>
 
 
                <div>
 
                  <label for="qsAyatStart">
                    Ayat awal
                  </label>
 
                  <input
                    id="qsAyatStart"
                    type="number"
                    min="1"
                    required
                  >
 
                </div>
 
 
                <div>
 
                  <label for="qsSurahEnd">
                    Surah akhir
                  </label>
 
                  <input
                    id="qsSurahEnd"
                    maxlength="100"
                    required
                  >
 
                </div>
 
 
                <div>
 
                  <label for="qsAyatEnd">
                    Ayat akhir
                  </label>
 
                  <input
                    id="qsAyatEnd"
                    type="number"
                    min="1"
                    required
                  >
 
                </div>
 
 
                <div>
 
                  <label for="qsJuz">
                    Jumlah hafalan (juz)
                  </label>
 
                  <input
                    id="qsJuz"
                    type="number"
                    min="0"
                    step="0.001"
                    value="0"
                    required
                  >
 
                </div>
 
              </div>
 
 
              <label for="qsNote">
                Catatan
              </label>
 
              <textarea
                id="qsNote"
                rows="2"
                maxlength="1000"
              ></textarea>
 
              ${quranFormActions("Simpan Setoran")}
 
            </form>
 
          </section>
 
        `
        : quranReadOnlyNotice()
    }
 
 
    <section class="panel saved-panel">
 
      <h3>Riwayat Setoran</h3>
 
      ${
        rows.length
          ? rows.map(r => `
 
              <div class="quran-list-row">
 
                <div>
 
                  <b>
                    ${escapeHTML(r.surah_awal || "—")}
                    : ${r.ayat_awal || "—"}
                    –
                    ${escapeHTML(r.surah_akhir || "—")}
                    : ${r.ayat_akhir || "—"}
                  </b>
 
                  <small>
                    ${formatDate(r.tanggal)}
                    · ${Number(r.jumlah_juz)} juz
 
                    ${
                      r.catatan
                        ? " · " + escapeHTML(r.catatan)
                        : ""
                    }
                  </small>
 
                </div>
 
 
                ${
                  quranCanManage()
                    ? `
 
                      <select
                        class="quran-status-select"
                        data-setoran-status="${r.id}"
                      >
 
                        <option
                          value="menunggu"
                          ${r.status === "menunggu" ? "selected" : ""}
                        >
                          Menunggu
                        </option>
 
                        <option
                          value="valid"
                          ${r.status === "valid" ? "selected" : ""}
                        >
                          Valid
                        </option>
 
                        <option
                          value="perlu_perbaikan"
                          ${r.status === "perlu_perbaikan" ? "selected" : ""}
                        >
                          Perlu perbaikan
                        </option>
 
                      </select>
 
                    `
                    : `
 
                      <span class="quran-status ${r.status}">
                        ${escapeHTML(r.status)}
                      </span>
 
                    `
                }
 
              </div>
 
            `).join("")
          : quranNotice("Belum ada setoran hafalan.")
      }
 
    </section>
 
  `;
 
 
  const form =
    document.getElementById("quranSetoranForm");
 
  if (form) {
 
    form.addEventListener(
      "submit",
      async event => {
 
        event.preventDefault();
 
        await quranSubmit(
          form,
          "quranFormMessage",
          async () => {
 
            const { error } =
              await supabaseClient
                .from("quran_setoran")
                .insert({
 
                  santri_id: studentId,
 
                  target_id:
                    document.getElementById("qsTarget").value
                    || null,
 
                  tanggal:
                    document.getElementById("qsDate").value,
 
                  surah_awal:
                    document.getElementById("qsSurahStart").value.trim(),
 
                  ayat_awal:
                    Number(
                      document.getElementById("qsAyatStart").value
                    ),
 
                  surah_akhir:
                    document.getElementById("qsSurahEnd").value.trim(),
 
                  ayat_akhir:
                    Number(
                      document.getElementById("qsAyatEnd").value
                    ),
 
                  jumlah_juz:
                    Number(
                      document.getElementById("qsJuz").value
                    ),
 
                  status: "menunggu",
 
                  guru_id: currentProfile.id,
 
                  catatan:
                    document.getElementById("qsNote").value.trim()
                    || null
 
                });
 
            if (error) throw error;
 
          }
        );
 
      }
    );
 
  }
 
 
  // PERUBAHAN STATUS SETORAN
  container.querySelectorAll(
    "[data-setoran-status]"
  ).forEach(select => {
 
    select.addEventListener(
      "change",
      async () => {
 
        try {
 
          const { error } =
            await supabaseClient
              .from("quran_setoran")
              .update({
                status: select.value,
                updated_at: new Date().toISOString()
              })
              .eq(
                "id",
                select.dataset.setoranStatus
              );
 
          if (error) throw error;
 
        } catch(error) {
 
          alert(
            "Status setoran gagal diperbarui: " +
            error.message
          );
 
          await loadQuranTabContent();
 
        }
 
      }
    );
 
  });
 
}
 
/* =====================================================
   29. TARGET MUROJAAH
===================================================== */
 
async function renderQuranTargetMurojaah(
  container,
  studentId
) {
 
  const rows = await quranFetch(
    "quran_target_murojaah",
    "id,periode_mulai,periode_selesai,target_sesi,catatan",
    studentId
  );
 
  container.innerHTML = `
 
    ${
      quranCanManage()
        ? `
 
          <section class="panel">
 
            <p class="eyebrow">
              PERENCANAAN PENGULANGAN
            </p>
 
            <h3>Buat Target Murojaah</h3>
 
            <form id="quranTargetMurojaahForm">
 
              <div class="form-grid">
 
                <div>
                  <label for="qtmStart">
                    Periode mulai
                  </label>
 
                  <input
                    id="qtmStart"
                    type="date"
                    value="${todayDate()}"
                    required
                  >
                </div>
 
                <div>
                  <label for="qtmEnd">
                    Periode selesai
                  </label>
 
                  <input
                    id="qtmEnd"
                    type="date"
                    required
                  >
                </div>
 
                <div>
                  <label for="qtmSessions">
                    Target sesi
                  </label>
 
                  <input
                    id="qtmSessions"
                    type="number"
                    min="0"
                    step="1"
                    required
                  >
                </div>
 
              </div>
 
              <label for="qtmNote">
                Catatan
              </label>
 
              <textarea
                id="qtmNote"
                rows="2"
                maxlength="1000"
              ></textarea>
 
              ${quranFormActions("Simpan Target Murojaah")}
 
            </form>
 
          </section>
 
        `
        : quranReadOnlyNotice()
    }
 
 
    <section class="panel saved-panel">
 
      <h3>Target Murojaah</h3>
 
      ${
        rows.length
          ? rows.map(r => `
 
              <div class="quran-list-row">
 
                <div>
 
                  <b>
                    ${r.target_sesi} sesi
                  </b>
 
                  <small>
                    ${formatDate(r.periode_mulai)}
                    –
                    ${formatDate(r.periode_selesai)}
 
                    ${
                      r.catatan
                        ? " · " + escapeHTML(r.catatan)
                        : ""
                    }
                  </small>
 
                </div>
 
              </div>
 
            `).join("")
          : quranNotice("Belum ada target murojaah.")
      }
 
    </section>
 
  `;
 
 
  const form =
    document.getElementById(
      "quranTargetMurojaahForm"
    );
 
  if (form) {
 
    form.addEventListener(
      "submit",
      async event => {
 
        event.preventDefault();
 
        await quranSubmit(
          form,
          "quranFormMessage",
          async () => {
 
            const start =
              document.getElementById("qtmStart").value;
 
            const end =
              document.getElementById("qtmEnd").value;
 
            if (end < start) {
 
              throw new Error(
                "Tanggal selesai tidak boleh sebelum tanggal mulai."
              );
 
            }
 
            const { error } =
              await supabaseClient
                .from("quran_target_murojaah")
                .insert({
 
                  santri_id: studentId,
 
                  periode_mulai: start,
 
                  periode_selesai: end,
 
                  target_sesi:
                    Number(
                      document.getElementById("qtmSessions").value
                    ),
 
                  guru_id: currentProfile.id,
 
                  catatan:
                    document.getElementById("qtmNote").value.trim()
                    || null
 
                });
 
            if (error) throw error;
 
          }
        );
 
      }
    );
 
  }
 
}
 
 
/* =====================================================
   30. PENCATATAN MUROJAAH
===================================================== */
 
async function renderQuranMurojaah(
  container,
  studentId
) {
 
  const [rows, targets] = await Promise.all([
 
    quranFetch(
      "quran_murojaah",
      "id,tanggal,target_id,jumlah_sesi,materi,catatan",
      studentId
    ),
 
    quranFetch(
      "quran_target_murojaah",
      "id,periode_mulai,periode_selesai,target_sesi",
      studentId
    )
 
  ]);
 
 
  container.innerHTML = `
 
    ${
      quranCanManage()
        ? `
 
          <section class="panel">
 
            <p class="eyebrow">
              CATATAN PELAKSANAAN
            </p>
 
            <h3>Input Murojaah</h3>
 
            <form id="quranMurojaahForm">
 
              <div class="form-grid">
 
                <div>
 
                  <label for="qmrDate">
                    Tanggal
                  </label>
 
                  <input
                    id="qmrDate"
                    type="date"
                    value="${todayDate()}"
                    required
                  >
 
                </div>
 
 
                <div>
 
                  <label for="qmrTarget">
                    Target Murojaah
                  </label>
 
                  <select id="qmrTarget">
 
                    <option value="">
                      Tanpa target
                    </option>
 
                    ${
                      targets.map(t => `
 
                        <option value="${t.id}">
 
                          ${formatDate(t.periode_mulai)}
                          · ${t.target_sesi} sesi
 
                        </option>
 
                      `).join("")
                    }
 
                  </select>
 
                </div>
 
 
                <div>
 
                  <label for="qmrSessions">
                    Jumlah sesi
                  </label>
 
                  <input
                    id="qmrSessions"
                    type="number"
                    min="1"
                    step="1"
                    value="1"
                    required
                  >
 
                </div>
 
              </div>
 
 
              <label for="qmrMaterial">
                Materi Murojaah
              </label>
 
              <input
                id="qmrMaterial"
                maxlength="200"
                placeholder="Contoh: Juz 30, Surah An-Naba'"
              >
 
 
              <label for="qmrNote">
                Catatan
              </label>
 
              <textarea
                id="qmrNote"
                rows="2"
                maxlength="1000"
              ></textarea>
 
 
              ${quranFormActions("Simpan Murojaah")}
 
            </form>
 
          </section>
 
        `
        : quranReadOnlyNotice()
    }
 
 
    <section class="panel saved-panel">
 
      <h3>Riwayat Murojaah</h3>
 
      ${
        rows.length
          ? rows.map(r => `
 
              <div class="quran-list-row">
 
                <div>
 
                  <b>
                    ${escapeHTML(r.materi || "Murojaah")}
                    · ${r.jumlah_sesi} sesi
                  </b>
 
                  <small>
                    ${formatDate(r.tanggal)}
 
                    ${
                      r.catatan
                        ? " · " + escapeHTML(r.catatan)
                        : ""
                    }
                  </small>
 
                </div>
 
              </div>
 
            `).join("")
          : quranNotice("Belum ada catatan murojaah.")
      }
 
    </section>
 
  `;
 
 
  const form =
    document.getElementById("quranMurojaahForm");
 
  if (form) {
 
    form.addEventListener(
      "submit",
      async event => {
 
        event.preventDefault();
 
        await quranSubmit(
          form,
          "quranFormMessage",
          async () => {
 
            const { error } =
              await supabaseClient
                .from("quran_murojaah")
                .insert({
 
                  santri_id: studentId,
 
                  target_id:
                    document.getElementById("qmrTarget").value
                    || null,
 
                  tanggal:
                    document.getElementById("qmrDate").value,
 
                  jumlah_sesi:
                    Number(
                      document.getElementById("qmrSessions").value
                    ),
 
                  materi:
                    document.getElementById("qmrMaterial").value.trim()
                    || null,
 
                  catatan:
                    document.getElementById("qmrNote").value.trim()
                    || null,
 
                  guru_id: currentProfile.id
 
                });
 
            if (error) throw error;
 
          }
        );
 
      }
    );
 
  }
 
}
 
 
/* =====================================================
   31. EVALUASI BACAAN AL-QUR'AN
===================================================== */
 
async function renderQuranEvaluasi(
  container,
  studentId
) {
 
  const rows = await quranFetch(
    "quran_evaluasi_bacaan",
    "id,tanggal_evaluasi,makhraj,tajwid,kelancaran,panjang_pendek,catatan",
    studentId
  );
 
 
  container.innerHTML = `
 
    ${
      quranCanManage()
        ? `
 
          <section class="panel">
 
            <p class="eyebrow">
              PENILAIAN BACAAN
            </p>
 
            <h3>Evaluasi Bacaan Al-Qur'an</h3>
 
            <p class="muted">
              Berikan penilaian berdasarkan hasil
              pengamatan guru terhadap bacaan santri.
            </p>
 
            <form id="quranEvaluasiForm">
 
              <div class="form-grid">
 
                <div>
 
                  <label for="qeDate">
                    Tanggal evaluasi
                  </label>
 
                  <input
                    id="qeDate"
                    type="date"
                    value="${todayDate()}"
                    required
                  >
 
                </div>
 
 
                ${
                  [
                    ["makhraj", "Makhraj"],
                    ["tajwid", "Tajwid"],
                    ["kelancaran", "Kelancaran"],
                    ["panjang_pendek", "Panjang-pendek"]
                  ].map(([id, label]) => `
 
                    <div>
 
                      <label for="qe_${id}">
                        ${label} (1–4)
                      </label>
 
                      <select id="qe_${id}">
 
                        <option value="1">
                          1 · Perlu bimbingan
                        </option>
 
                        <option value="2">
                          2 · Cukup
                        </option>
 
                        <option value="3" selected>
                          3 · Baik
                        </option>
 
                        <option value="4">
                          4 · Sangat baik
                        </option>
 
                      </select>
 
                    </div>
 
                  `).join("")
                }
 
              </div>
 
 
              <label for="qeNote">
                Catatan pembimbing
              </label>
 
              <textarea
                id="qeNote"
                rows="3"
                maxlength="1500"
                placeholder="Tuliskan catatan dan rekomendasi pembimbing..."
              ></textarea>
 
 
              ${quranFormActions("Simpan Evaluasi")}
 
            </form>
 
          </section>
 
        `
        : quranReadOnlyNotice()
    }
 
 
    <section class="panel saved-panel">
 
      <h3>Riwayat Evaluasi Bacaan</h3>
 
      ${
        rows.length
          ? rows.map(r => `
 
              <article class="quran-eval-item">
 
                <div class="panel-heading">
 
                  <b>
                    ${formatDate(r.tanggal_evaluasi)}
                  </b>
 
                  <span class="quran-status valid">
 
                    Rata-rata
                    ${
                      (
                        (
                          r.makhraj +
                          r.tajwid +
                          r.kelancaran +
                          r.panjang_pendek
                        ) / 4
                      ).toFixed(2)
                    }/4
 
                  </span>
 
                </div>
 
 
                <div class="quran-score-grid">
 
                  ${quranScore("Makhraj", r.makhraj)}
 
                  ${quranScore("Tajwid", r.tajwid)}
 
                  ${quranScore("Kelancaran", r.kelancaran)}
 
                  ${quranScore(
                    "Panjang-pendek",
                    r.panjang_pendek
                  )}
 
                </div>
 
 
                <p class="muted">
                  ${escapeHTML(r.catatan || "Tidak ada catatan.")}
                </p>
 
              </article>
 
            `).join("")
          : quranNotice("Belum ada evaluasi bacaan.")
      }
 
    </section>
 
  `;
 
 
  const form =
    document.getElementById("quranEvaluasiForm");
 
  if (form) {
 
    form.addEventListener(
      "submit",
      async event => {
 
        event.preventDefault();
 
        await quranSubmit(
          form,
          "quranFormMessage",
          async () => {
 
            const { error } =
              await supabaseClient
                .from("quran_evaluasi_bacaan")
                .insert({
 
                  santri_id: studentId,
 
                  tanggal_evaluasi:
                    document.getElementById("qeDate").value,
 
                  makhraj:
                    Number(
                      document.getElementById("qe_makhraj").value
                    ),
 
                  tajwid:
                    Number(
                      document.getElementById("qe_tajwid").value
                    ),
 
                  kelancaran:
                    Number(
                      document.getElementById("qe_kelancaran").value
                    ),
 
                  panjang_pendek:
                    Number(
                      document.getElementById("qe_panjang_pendek").value
                    ),
 
                  guru_id: currentProfile.id,
 
                  catatan:
                    document.getElementById("qeNote").value.trim()
                    || null
 
                });
 
            if (error) throw error;
 
          }
        );
 
      }
    );
 
  }
 
}
 
 
/* =====================================================
   32. FUNGSI SIMPAN DATA QURAN
===================================================== */
 
async function quranSubmit(
  form,
  messageId,
  action
) {
 
  const button =
    form.querySelector('button[type="submit"]');
 
  const message =
    document.getElementById(messageId);
 
 
  if (button) {
 
    if (!button.dataset.originalLabel) {
      button.dataset.originalLabel = button.textContent.trim();
    }
 
    button.disabled = true;
 
    button.textContent = "Menyimpan...";
 
  }
 
  if (message) {
 
    message.textContent = "";
 
    message.classList.remove("success");
 
  }
 
 
  try {
 
    if (!quranCanManage()) {
 
      throw new Error(
        "Akun ini tidak memiliki izin untuk mengubah data."
      );
 
    }
 
    await action();
 
    if (message) {
 
      message.textContent =
        "Data berhasil disimpan.";
 
      message.classList.add("success");
 
    }
 
    await loadQuranTabContent();
 
  } catch(error) {
 
    console.error(
      "QURAN SAVE ERROR:",
      error
    );
 
    if (message) {
 
      message.textContent =
        "Gagal menyimpan: " + error.message;
 
    } else {
 
      alert(
        "Gagal menyimpan: " + error.message
      );
 
    }
 
  } finally {
 
    if (button) {
 
      button.disabled = false;
 
      button.textContent =
        button.dataset.originalLabel || "Simpan data";
 
    }
 
  }
 
}
 
/* =====================================================
   MODUL EKSPLORE SANTRI
===================================================== */
 
let exploreSelectedStudent = "";
let exploreSkills = [];
let explorePeriods = [];
let exploreAssessments = [];
 
function exploreIsStaff() {
  return ["Admin", "Guru"].includes(
    currentProfile?.role || ""
  );
}
 
function exploreStatusLabel(status) {
  const labels = {
    diajukan: "Menunggu Persetujuan",
    aktif: "Sedang Berlangsung",
    selesai: "Selesai",
    dibatalkan: "Ditolak"
  };
 
  return labels[status] || status || "-";
}
 
function exploreStatusClass(status) {
  const classes = {
    diajukan: "pending",
    aktif: "valid",
    selesai: "valid",
    dibatalkan: "invalid"
  };
 
  return classes[status] || "";
}
 
async function renderExplore() {
 
  pageContent.innerHTML = `
    <section class="panel">
      <p class="eyebrow">PENGEMBANGAN DIRI</p>
      <h3>Memuat Eksplor Santri...</h3>
      <p class="muted">Mengambil data keterampilan dan perkembangan.</p>
    </section>
  `;
 
  try {
 
    await loadStudents();
 
    if (!studentList.length) {
      pageContent.innerHTML = `
        <section class="panel">
          <h3>Data santri belum terhubung</h3>
          <p class="muted">
            Belum ditemukan data santri yang dapat diakses akun ini.
          </p>
        </section>
      `;
      return;
    }
 
    if (
      !studentList.some(
        s => s.id === exploreSelectedStudent
      )
    ) {
      exploreSelectedStudent = studentList[0].id;
    }
 
    const { data: skills, error: skillError } =
      await supabaseClient
        .from("mastery_skills")
        .select("id,nama_skill,deskripsi,ikon,urutan,aktif")
        .eq("aktif", true)
        .order("urutan");
 
    if (skillError) throw skillError;
 
    exploreSkills = skills || [];
 
    await exploreLoadPeriods();
 
    await exploreRenderContent();
 
  } catch(error) {
 
    console.error("EXPLORE LOAD ERROR:", error);
 
    pageContent.innerHTML = `
      <section class="panel">
        <h3>Eksplor belum dapat dimuat</h3>
        <p class="message">
          ${escapeHTML(error.message)}
        </p>
        <p class="muted">
          Periksa tabel mastery_skills, explore_periods,
          explore_assessments, dan kebijakan RLS Supabase.
        </p>
      </section>
    `;
 
  }
 
}
 
 
async function exploreLoadPeriods() {
 
  let query = supabaseClient
    .from("explore_periods")
    .select(`
      id,
      santri_id,
      skill_id,
      status,
      tanggal_mulai,
      tanggal_selesai,
      guru_id,
      alasan_memilih,
      tujuan_pengembangan,
      catatan_persetujuan,
      tanggal_persetujuan,
      hasil_akhir,
      created_at
    `)
    .eq("santri_id", exploreSelectedStudent)
    .order("created_at", {
      ascending: false
    });
 
  const { data, error } = await query;
 
  if (error) throw error;
 
  explorePeriods = data || [];
 
  const periodIds = explorePeriods.map(
    item => item.id
  );
 
  exploreAssessments = [];
 
  if (!periodIds.length) return;
 
  const { data: assessments, error: assessmentError } =
    await supabaseClient
      .from("explore_assessments")
      .select(`
        id,
        period_id,
        tanggal_penilaian,
        nilai,
        tingkat_penguasaan,
        deskripsi_perkembangan,
        kekuatan,
        aspek_perbaikan,
        rekomendasi,
        portofolio_url,
        guru_id,
        created_at
      `)
      .in("period_id", periodIds)
      .order("tanggal_penilaian", {
        ascending: false
      });
 
  if (assessmentError) throw assessmentError;
 
  exploreAssessments = assessments || [];
 
}
 
 
function exploreGetSkill(skillId) {
  return exploreSkills.find(
    skill => skill.id === skillId
  );
}
 
 
function exploreStudentSelector() {
 
  if (!exploreIsStaff() && studentList.length === 1) {
    return `
      <div class="explore-student-fixed">
        ${escapeHTML(studentList[0].nama)}
        · ${escapeHTML(studentList[0].kelas || "")}
      </div>
    `;
  }
 
  if (!exploreIsStaff()) return "";
 
  return `
    <div>
      <label for="exploreStudent">Pilih Santri</label>
      <select id="exploreStudent">
        ${studentList.map(s => `
          <option
            value="${escapeHTML(s.id)}"
            ${s.id === exploreSelectedStudent ? "selected" : ""}
          >
            ${escapeHTML(s.nama)}
            — ${escapeHTML(s.kelas || "-")}
          </option>
        `).join("")}
      </select>
    </div>
  `;
 
}
 
 
async function exploreRenderContent() {
 
  const role = currentProfile?.role || "";
  const isStaff = exploreIsStaff();
  const isStudent = role === "Santri";
 
  const activePeriod = explorePeriods.find(
    p => ["diajukan", "aktif"].includes(p.status)
  );
 
  const completedCount = explorePeriods.filter(
    p => p.status === "selesai"
  ).length;
 
  pageContent.innerHTML = `
 
    <section class="quran-hero explore-hero">
      <div>
        <p class="eyebrow">PENGEMBANGAN POTENSI</p>
        <h3>Eksplor Santri</h3>
        <p>
          Ruang untuk mengenali minat, mengembangkan keterampilan,
          dan mendokumentasikan proses belajar santri.
        </p>
      </div>
      <div class="quran-hero-mark">✦</div>
    </section>
 
    <section class="panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">RINGKASAN PERKEMBANGAN</p>
          <h3>Aktivitas Eksplor</h3>
        </div>
        <span class="quran-role">
          ${escapeHTML(roleLabel(role))}
        </span>
      </div>
 
      ${exploreStudentSelector()}
 
      <div class="quran-metrics">
        <article>
          <small>Total Program</small>
          <strong>${explorePeriods.length}</strong>
          <span>riwayat eksplor</span>
        </article>
        <article>
          <small>Program Aktif</small>
          <strong>
            ${explorePeriods.filter(p => p.status === "aktif").length}
          </strong>
          <span>sedang dikembangkan</span>
        </article>
        <article>
          <small>Menunggu</small>
          <strong>
            ${explorePeriods.filter(p => p.status === "diajukan").length}
          </strong>
          <span>persetujuan guru</span>
        </article>
        <article>
          <small>Selesai</small>
          <strong>${completedCount}</strong>
          <span>program tuntas</span>
        </article>
      </div>
    </section>
 
    ${isStudent ? exploreApplicationForm(activePeriod) : ""}
 
    ${isStaff ? exploreApprovalSection() : ""}
 
    <section class="panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">CATATAN PERJALANAN</p>
          <h3>Riwayat Eksplor</h3>
        </div>
      </div>
 
      ${exploreHistoryHTML()}
    </section>
 
  `;
 
  const studentSelect =
    document.getElementById("exploreStudent");
 
  if (studentSelect) {
    studentSelect.addEventListener("change", async () => {
      exploreSelectedStudent = studentSelect.value;
      await exploreLoadPeriods();
      await exploreRenderContent();
    });
  }
 
  exploreBindApplicationForm();
  exploreBindApprovalButtons();
  exploreBindAssessmentForms();
 
}
 
 
function exploreApplicationForm(activePeriod) {
 
  if (activePeriod) {
    return `
      <section class="panel">
        <p class="eyebrow">PENGAJUAN KETERAMPILAN</p>
        <h3>Pengajuan Belum Dapat Dibuat</h3>
        <div class="notice">
          <b>Masih ada program aktif</b>
          <span>
            Selesaikan atau batalkan program yang sedang berjalan
            sebelum mengajukan keterampilan berikutnya.
          </span>
        </div>
      </section>
    `;
  }
 
  return `
    <section class="panel">
      <p class="eyebrow">PILIH MINAT DAN BAKAT</p>
      <h3>Ajukan Keterampilan Baru</h3>
      <p class="muted">
        Pilih satu keterampilan yang ingin dikembangkan.
        Pengajuan akan diperiksa oleh guru.
      </p>
 
      <form id="exploreApplicationForm">
 
        <div class="form-grid">
 
          <div>
            <label for="exploreSkill">Keterampilan</label>
            <select id="exploreSkill" required>
              <option value="">Pilih keterampilan</option>
              ${exploreSkills.map(skill => `
                <option value="${escapeHTML(skill.id)}">
                  ${escapeHTML(skill.ikon || "✦")}
                  ${escapeHTML(skill.nama_skill)}
                </option>
              `).join("")}
            </select>
          </div>
 
        </div>
 
        <label for="exploreReason">Alasan Memilih</label>
        <textarea
          id="exploreReason"
          rows="3"
          maxlength="1000"
          required
          placeholder="Mengapa kamu tertarik mengembangkan keterampilan ini?"
        ></textarea>
 
        <label for="exploreGoal">Tujuan Pengembangan</label>
        <textarea
          id="exploreGoal"
          rows="3"
          maxlength="1000"
          required
          placeholder="Apa yang ingin kamu kuasai atau hasilkan?"
        ></textarea>
 
        <div class="form-actions">
          <button class="primary" type="submit">
            Kirim Pengajuan
          </button>
        </div>
 
        <p id="exploreApplicationMessage" class="message" role="status"></p>
 
      </form>
    </section>
  `;
 
}
 
 
function exploreApprovalSection() {
 
  const pending = explorePeriods.filter(
    p => p.status === "diajukan"
  );
 
  return `
    <section class="panel">
      <p class="eyebrow">PENGELOLAAN PROGRAM</p>
      <h3>Pengajuan Menunggu Persetujuan</h3>
 
      ${
        pending.length
          ? pending.map(p => {
              const skill = exploreGetSkill(p.skill_id);
 
              return `
                <article class="quran-eval-item">
                  <div class="panel-heading">
                    <b>${escapeHTML(skill?.nama_skill || "Keterampilan")}</b>
                    <span class="quran-status pending">Menunggu</span>
                  </div>
 
                  <p class="muted">
                    ${escapeHTML(p.alasan_memilih || "-")}
                  </p>
 
                  <p>
                    <b>Tujuan:</b>
                    ${escapeHTML(p.tujuan_pengembangan || "-")}
                  </p>
 
                  <div class="form-grid">
                    <div>
                      <label for="exploreStart_${p.id}">Tanggal Mulai</label>
                      <input type="date" id="exploreStart_${p.id}" required>
                    </div>
                    <div>
                      <label for="exploreEnd_${p.id}">Tanggal Selesai</label>
                      <input type="date" id="exploreEnd_${p.id}" required>
                    </div>
                  </div>
 
                  <label for="exploreApprovalNote_${p.id}">
                    Catatan Persetujuan
                  </label>
                  <textarea
                    id="exploreApprovalNote_${p.id}"
                    rows="2"
                    maxlength="1000"
                  ></textarea>
 
                  <div class="form-actions">
                    <button
                      class="primary"
                      type="button"
                      data-explore-approve="${p.id}"
                    >
                      Setujui Program
                    </button>
                    <button
                      class="secondary"
                      type="button"
                      data-explore-reject="${p.id}"
                    >
                      Tolak Pengajuan
                    </button>
                  </div>
                </article>
              `;
            }).join("")
          : `<p class="muted">Tidak ada pengajuan yang menunggu persetujuan.</p>`
      }
    </section>
  `;
 
}
 
 
function exploreHistoryHTML() {
 
  if (!explorePeriods.length) {
    return `
      <p class="muted">
        Belum ada riwayat pengembangan keterampilan.
      </p>
    `;
  }
 
  return explorePeriods.map(period => {
 
    const skill = exploreGetSkill(period.skill_id);
 
    const assessments = exploreAssessments.filter(
      a => a.period_id === period.id
    );
 
    return `
      <article class="quran-eval-item">
 
        <div class="panel-heading">
          <div>
            <b>
              ${escapeHTML(skill?.ikon || "✦")}
              ${escapeHTML(skill?.nama_skill || "Keterampilan")}
            </b>
            <small>
              ${formatDate(period.tanggal_mulai)}
              ${period.tanggal_selesai
                ? " – " + formatDate(period.tanggal_selesai)
                : ""}
            </small>
          </div>
 
          <span class="quran-status ${exploreStatusClass(period.status)}">
            ${escapeHTML(exploreStatusLabel(period.status))}
          </span>
        </div>
 
        <p>
          <b>Alasan:</b>
          ${escapeHTML(period.alasan_memilih || "-")}
        </p>
 
        <p>
          <b>Tujuan:</b>
          ${escapeHTML(period.tujuan_pengembangan || "-")}
        </p>
 
        ${
          period.catatan_persetujuan
            ? `<p class="muted"><b>Catatan Guru:</b> ${escapeHTML(period.catatan_persetujuan)}</p>`
            : ""
        }
 
        ${
          period.hasil_akhir
            ? `<p><b>Hasil Akhir:</b> ${escapeHTML(period.hasil_akhir)}</p>`
            : ""
        }
 
        ${
          assessments.length
            ? `
              <div class="notice">
                <b>Penilaian Perkembangan</b>
                ${assessments.map(a => `
                  <div class="row">
                    <span>${formatDate(a.tanggal_penilaian)}</span>
                    <b>${Number(a.nilai)}/100</b>
                  </div>
                  <p>${escapeHTML(a.tingkat_penguasaan || "")}</p>
                  <p>${escapeHTML(a.deskripsi_perkembangan || "")}</p>
                  ${
                    a.rekomendasi
                      ? `<small>Rekomendasi: ${escapeHTML(a.rekomendasi)}</small>`
                      : ""
                  }
                `).join("")}
              </div>
            `
            : `<p class="muted">Belum ada penilaian perkembangan.</p>`
        }
 
        ${
          exploreIsStaff() && period.status === "aktif"
            ? exploreAssessmentForm(period.id)
            : ""
        }
 
        ${
          exploreIsStaff() && period.status === "aktif"
            ? `
              <form data-explore-complete="${period.id}">
                <label for="exploreFinal_${period.id}">
                  Hasil Akhir Program
                </label>
                <textarea
                  id="exploreFinal_${period.id}"
                  rows="2"
                  required
                  maxlength="1500"
                  placeholder="Tuliskan hasil akhir pengembangan keterampilan..."
                ></textarea>
                <button class="secondary" type="submit">
                  Tandai Selesai
                </button>
              </form>
            `
            : ""
        }
 
      </article>
    `;
 
  }).join("");
 
}
 
 
function exploreAssessmentForm(periodId) {
 
  return `
    <details class="explore-assessment">
      <summary>Tambah Penilaian Perkembangan</summary>
 
      <form data-explore-assessment="${periodId}">
 
        <div class="form-grid">
          <div>
            <label for="exploreScore_${periodId}">Nilai (0–100)</label>
            <input
              id="exploreScore_${periodId}"
              type="number"
              min="0"
              max="100"
              required
            >
          </div>
 
          <div>
            <label for="exploreLevel_${periodId}">Tingkat Penguasaan</label>
            <input
              id="exploreLevel_${periodId}"
              type="text"
              maxlength="100"
              required
              placeholder="Contoh: Berkembang"
            >
          </div>
 
        </div>
 
        <label for="exploreProgress_${periodId}">
          Deskripsi Perkembangan
        </label>
        <textarea
          id="exploreProgress_${periodId}"
          rows="3"
          required
          maxlength="1500"
        ></textarea>
 
        <label for="exploreStrength_${periodId}">
          Kekuatan Santri
        </label>
        <textarea
          id="exploreStrength_${periodId}"
          rows="2"
          maxlength="1000"
        ></textarea>
 
        <label for="exploreImprove_${periodId}">
          Aspek yang Perlu Ditingkatkan
        </label>
        <textarea
          id="exploreImprove_${periodId}"
          rows="2"
          maxlength="1000"
        ></textarea>
 
        <label for="exploreRecommendation_${periodId}">
          Rekomendasi
        </label>
        <textarea
          id="exploreRecommendation_${periodId}"
          rows="2"
          maxlength="1000"
        ></textarea>
 
        <label for="explorePortfolio_${periodId}">
          Tautan Portofolio (opsional)
        </label>
        <input
          id="explorePortfolio_${periodId}"
          type="url"
          placeholder="https://..."
        >
 
        <button class="primary" type="submit">
          Simpan Penilaian
        </button>
 
      </form>
    </details>
  `;
 
}
 
 
function exploreBindApplicationForm() {
 
  const form = document.getElementById(
    "exploreApplicationForm"
  );
 
  if (!form) return;
 
  form.addEventListener("submit", async event => {
 
    event.preventDefault();
 
    const message = document.getElementById(
      "exploreApplicationMessage"
    );
 
    const button = form.querySelector(
      'button[type="submit"]'
    );
 
    button.disabled = true;
    button.textContent = "Mengirim...";
 
    try {
 
      if (currentProfile?.role !== "Santri") {
        throw new Error("Hanya akun Santri yang dapat mengajukan keterampilan.");
      }
 
      const { data: active, error: activeError } =
        await supabaseClient
          .from("explore_periods")
          .select("id")
          .eq("santri_id", exploreSelectedStudent)
          .in("status", ["diajukan", "aktif"]);
 
      if (activeError) throw activeError;
 
      if (active?.length) {
        throw new Error("Masih ada program yang menunggu persetujuan atau sedang aktif.");
      }
 
      const { error } = await supabaseClient
        .from("explore_periods")
        .insert({
          santri_id: exploreSelectedStudent,
          skill_id: document.getElementById("exploreSkill").value,
          status: "diajukan",
          alasan_memilih: document.getElementById("exploreReason").value.trim(),
          tujuan_pengembangan: document.getElementById("exploreGoal").value.trim(),
          created_by: currentUser.id
        });
 
      if (error) throw error;
 
      message.textContent = "Pengajuan berhasil dikirim.";
      message.classList.add("success");
 
      await exploreLoadPeriods();
      await exploreRenderContent();
 
    } catch(error) {
 
      console.error("EXPLORE APPLICATION ERROR:", error);
      message.textContent = "Gagal mengirim pengajuan: " + error.message;
 
    } finally {
 
      button.disabled = false;
      button.textContent = "Kirim Pengajuan";
 
    }
 
  });
 
}
 
 
function exploreBindApprovalButtons() {
 
  document.querySelectorAll("[data-explore-approve]").forEach(button => {
 
    button.addEventListener("click", async () => {
 
      const id = button.dataset.exploreApprove;
 
      const start = document.getElementById(
        "exploreStart_" + id
      ).value;
 
      const end = document.getElementById(
        "exploreEnd_" + id
      ).value;
 
      const note = document.getElementById(
        "exploreApprovalNote_" + id
      ).value.trim();
 
      if (!start || !end || end < start) {
        alert("Tanggal mulai dan selesai harus diisi dengan benar.");
        return;
      }
 
      button.disabled = true;
 
      try {
 
        if (!exploreIsStaff()) {
          throw new Error("Akses tidak diizinkan.");
        }
 
        const { error } = await supabaseClient
          .from("explore_periods")
          .update({
            status: "aktif",
            tanggal_mulai: start,
            tanggal_selesai: end,
            guru_id: currentUser.id,
            catatan_persetujuan: note,
            tanggal_persetujuan: todayDate()
          })
          .eq("id", id);
 
        if (error) throw error;
 
        await exploreLoadPeriods();
        await exploreRenderContent();
 
      } catch(error) {
 
        alert("Gagal menyetujui pengajuan: " + error.message);
        button.disabled = false;
 
      }
 
    });
 
  });
 
 
  document.querySelectorAll("[data-explore-reject]").forEach(button => {
 
    button.addEventListener("click", async () => {
 
      if (!confirm("Tolak pengajuan keterampilan ini?")) return;
 
      try {
 
        if (!exploreIsStaff()) {
          throw new Error("Akses tidak diizinkan.");
        }
 
        const { error } = await supabaseClient
          .from("explore_periods")
          .update({
            status: "dibatalkan",
            guru_id: currentUser.id,
            tanggal_persetujuan: todayDate()
          })
          .eq("id", button.dataset.exploreReject);
 
        if (error) throw error;
 
        await exploreLoadPeriods();
        await exploreRenderContent();
 
      } catch(error) {
 
        alert("Gagal memproses pengajuan: " + error.message);
 
      }
 
    });
 
  });
 
}
 
 
function exploreBindAssessmentForms() {
 
  document.querySelectorAll("[data-explore-assessment]").forEach(form => {
 
    form.addEventListener("submit", async event => {
 
      event.preventDefault();
 
      try {
 
        if (!exploreIsStaff()) {
          throw new Error("Akses tidak diizinkan.");
        }
 
        const periodId = form.dataset.exploreAssessment;
 
        const score = Number(
          document.getElementById("exploreScore_" + periodId).value
        );
 
        if (!Number.isFinite(score) || score < 0 || score > 100) {
          throw new Error("Nilai harus berada pada rentang 0 sampai 100.");
        }
 
        const { error } = await supabaseClient
          .from("explore_assessments")
          .insert({
            period_id: periodId,
            tanggal_penilaian: todayDate(),
            nilai: score,
            tingkat_penguasaan: document.getElementById("exploreLevel_" + periodId).value.trim(),
            deskripsi_perkembangan: document.getElementById("exploreProgress_" + periodId).value.trim(),
            kekuatan: document.getElementById("exploreStrength_" + periodId).value.trim() || null,
            aspek_perbaikan: document.getElementById("exploreImprove_" + periodId).value.trim() || null,
            rekomendasi: document.getElementById("exploreRecommendation_" + periodId).value.trim() || null,
            portofolio_url: document.getElementById("explorePortfolio_" + periodId).value.trim() || null,
            guru_id: currentUser.id
          });
 
        if (error) throw error;
 
        alert("Penilaian berhasil disimpan.");
 
        await exploreLoadPeriods();
        await exploreRenderContent();
 
      } catch(error) {
 
        alert("Gagal menyimpan penilaian: " + error.message);
 
      }
 
    });
 
  });
 
 
  document.querySelectorAll("[data-explore-complete]").forEach(form => {
 
    form.addEventListener("submit", async event => {
 
      event.preventDefault();
 
      try {
 
        if (!exploreIsStaff()) {
          throw new Error("Akses tidak diizinkan.");
        }
 
        const id = form.dataset.exploreComplete;
 
        const result = document.getElementById(
          "exploreFinal_" + id
        ).value.trim();
 
        const { error } = await supabaseClient
          .from("explore_periods")
          .update({
            status: "selesai",
            hasil_akhir: result
          })
          .eq("id", id);
 
        if (error) throw error;
 
        await exploreLoadPeriods();
        await exploreRenderContent();
 
      } catch(error) {
 
        alert("Gagal menyelesaikan program: " + error.message);
 
      }
 
    });
 
  });
 
}
 
/* =====================================================
   INISIALISASI APLIKASI
   Dijalankan setelah seluruh modul didefinisikan.
===================================================== */
 
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkSession, { once: true });
} else {
  checkSession();
}
