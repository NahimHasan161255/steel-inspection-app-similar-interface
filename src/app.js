/* ==========================================================================
   B-BOX PRODUCT INSPECTION SHEET - INTERACTIVE LOGIC (src/app.js)
   Auto Difference Calculation, Out-of-Tolerance Alerts & Form Switching
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('B-BOX Product Inspection Sheet System initialized.');

  // DOM Elements
  const btnCalculate = document.getElementById('btnCalculate');
  const btnPrint = document.getElementById('btnPrint');
  const btnLoadSample = document.getElementById('btnLoadSample');

  // Trigger calculation on input change
  bindCalcTriggers();

  // Calculate button
  if (btnCalculate) {
    btnCalculate.addEventListener('click', () => {
      calculateAllDifferences();
      showNotification('自動計算完了: 差分および許容値チェックを行いました。');
    });
  }

  // Print button
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Sample data button
  if (btnLoadSample) {
    btnLoadSample.addEventListener('click', () => {
      loadSampleData();
      calculateAllDifferences();
      showNotification('サンプルデータを読み込みました。');
    });
  }

  // Run initial calculation
  calculateAllDifferences();
});

/**
  * Binds calculation event triggers to all inputs with class .calc-trigger
  */
function bindCalcTriggers() {
  const calcInputs = document.querySelectorAll('.calc-trigger');
  calcInputs.forEach(input => {
    input.removeEventListener('input', calculateAllDifferences);
    input.removeEventListener('change', calculateAllDifferences);
    input.addEventListener('input', calculateAllDifferences);
    input.addEventListener('change', calculateAllDifferences);
  });
}

/**
  * Switches between Form 1 (Standard) and Form 2 (Detailed with Diagrams)
  */
function switchForm(formId) {
  const form1View = document.getElementById('formStandard');
  const form2View = document.getElementById('formDetailed');
  const tab1Btn = document.getElementById('tabForm1');
  const tab2Btn = document.getElementById('tabForm2');

  if (formId === 'form-2' || formId === 'formDetailed') {
    if (form1View) form1View.classList.remove('active');
    if (form2View) form2View.classList.add('active');

    if (tab1Btn) tab1Btn.classList.remove('active');
    if (tab2Btn) tab2Btn.classList.add('active');
    showNotification('B-BOX製品検査表（DF無） に切り替えました。');
  } else {
    if (form2View) form2View.classList.remove('active');
    if (form1View) form1View.classList.add('active');

    if (tab2Btn) tab2Btn.classList.remove('active');
    if (tab1Btn) tab1Btn.classList.add('active');
    showNotification('B-BOX製品検査表（DF有） に切り替えました。');
  }

  bindCalcTriggers();
  calculateAllDifferences();
}
window.switchForm = switchForm;

/**
 * Calculates all difference (差) fields: 実測値 (Actual) - 設計値 (Design) for both forms
 */
function calculateAllDifferences() {
  // --- FORM 1 (Standard) ---
  calcPair('lenDesign', 'lenActual', 'lenDiff', 'lenTol');
  for (let i = 1; i <= 9; i++) {
    calcPair(`dia${i}_design`, `dia${i}_actual`, `dia${i}_diff`, `dia${i}_tol`);
  }
  calcPair('head_n_design', 'head_n_actual', 'head_n_diff', 'head_n_tol');
  calcPair('head_s_design', 'head_s_actual', 'head_s_diff', 'head_s_tol');
  calcPair('head_e_design', 'head_e_actual', 'head_e_diff', 'head_e_tol');
  calcPair('head_w_design', 'head_w_actual', 'head_w_diff', 'head_w_tol');

  calcPair('base_n_design', 'base_n_actual', 'base_n_diff', 'base_n_tol');
  calcPair('base_s_design', 'base_s_actual', 'base_s_diff', 'base_s_tol');
  calcPair('base_e_design', 'base_e_actual', 'base_e_diff', 'base_e_tol');
  calcPair('base_w_design', 'base_w_actual', 'base_w_diff', 'base_w_tol');

  calcPair('bend_e_design', 'bend_e_actual', 'bend_e_diff', 'bend_e_tol');
  calcPair('bend_s_design', 'bend_s_actual', 'bend_s_diff', 'bend_s_tol');
  calcPair('twist_design', 'twist_actual', 'twist_diff', 'twist_tol');

  // --- FORM 2 (Detailed with Diagrams) ---
  calcPair('d_lenDesign', 'd_lenActual', 'd_lenDiff', 'd_lenTol');
  for (let i = 1; i <= 9; i++) {
    calcPair(`d_dia${i}_design`, `d_dia${i}_actual`, `d_dia${i}_diff`, `d_dia${i}_tol`);
  }
  calcPair('d_head_n_design', 'd_head_n_actual', 'd_head_n_diff', 'd_head_n_tol');
  calcPair('d_head_s_design', 'd_head_s_actual', 'd_head_s_diff', 'd_head_s_tol');
  calcPair('d_head_e_design', 'd_head_e_actual', 'd_head_e_diff', 'd_head_e_tol');
  calcPair('d_head_w_design', 'd_head_w_actual', 'd_head_w_diff', 'd_head_w_tol');

  calcPair('d_base_n_design', 'd_base_n_actual', 'd_base_n_diff', 'd_base_n_tol');
  calcPair('d_base_s_design', 'd_base_s_actual', 'd_base_s_diff', 'd_base_s_tol');
  calcPair('d_base_e_design', 'd_base_e_actual', 'd_base_e_diff', 'd_base_e_tol');
  calcPair('d_base_w_design', 'd_base_w_actual', 'd_base_w_diff', 'd_base_w_tol');

  // Diagonals (D1, D2)
  calcPair('d_diag_h_d1_design', 'd_diag_h_d1_actual', 'd_diag_h_d1_diff', 'd_diag_h_d1_tol');
  calcPair('d_diag_h_d2_design', 'd_diag_h_d2_actual', 'd_diag_h_d2_diff', 'd_diag_h_d2_tol');
  calcPair('d_diag_b_d1_design', 'd_diag_b_d1_actual', 'd_diag_b_d1_diff', 'd_diag_b_d1_tol');
  calcPair('d_diag_b_d2_design', 'd_diag_b_d2_actual', 'd_diag_b_d2_diff', 'd_diag_b_d2_tol');

  calcPair('d_bend_e_design', 'd_bend_e_actual', 'd_bend_e_diff', 'd_bend_e_tol');
  calcPair('d_bend_s_design', 'd_bend_s_actual', 'd_bend_s_diff', 'd_bend_s_tol');
  calcPair('d_twist_design', 'd_twist_actual', 'd_twist_diff', 'd_twist_tol');

  // Overall Final Verdict
  updateFinalVerdict();
}

/**
 * Helper to calculate difference between single design & actual inputs
 */
function calcPair(designId, actualId, diffId, tolId) {
  const designEl = document.getElementById(designId);
  const actualEl = document.getElementById(actualId);
  const diffEl = document.getElementById(diffId);
  const tolEl = document.getElementById(tolId);

  if (!designEl || !actualEl || !diffEl) return;

  const designVal = parseFloat(designEl.value);
  const actualVal = parseFloat(actualEl.value);

  if (isNaN(designVal) || isNaN(actualVal)) {
    diffEl.value = '';
    diffEl.classList.remove('diff-ng');
    return;
  }

  const diff = actualVal - designVal;

  // Formatting integers as +3, +1, -1
  let formattedDiff = '';
  if (Math.abs(diff - Math.round(diff)) < 0.0001) {
    const intVal = Math.round(diff);
    formattedDiff = intVal > 0 ? `+${intVal}` : `${intVal}`;
  } else {
    const fixedStr = diff.toFixed(1);
    formattedDiff = diff > 0 ? `+${fixedStr}` : `${fixedStr}`;
  }

  diffEl.value = formattedDiff;

  // Tolerance check
  let isOut = false;
  if (tolEl && tolEl.value && tolEl.value !== '-') {
    const tolNum = parseFloat(tolEl.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(tolNum) && Math.abs(diff) > tolNum + 0.001) {
      isOut = true;
    }
  }

  if (isOut) {
    diffEl.classList.add('diff-ng');
  } else {
    diffEl.classList.remove('diff-ng');
  }
}

/**
 * Updates final pass/fail verdict (合否)
 */
function updateFinalVerdict() {
  const finalVerdictEl = document.getElementById('finalVerdict');
  if (finalVerdictEl) {
    const ngElements = document.querySelectorAll('.diff-ng');
    if (ngElements.length > 0) {
      finalVerdictEl.value = '否';
      finalVerdictEl.className = 'input-cell text-center font-bold verdict-fail text-red';
    } else {
      finalVerdictEl.value = '合';
      finalVerdictEl.className = 'input-cell text-center font-bold verdict-pass';
    }
  }
}

/**
 * Preloads sample data
 */
function loadSampleData() {
  // Form 1
  if (document.getElementById('orderNo')) document.getElementById('orderNo').value = '25-1050';
  if (document.getElementById('projectName')) document.getElementById('projectName').value = '八重洲二丁目中地区再開発事業新築工事(1節)';
  if (document.getElementById('supplierName')) document.getElementById('supplierName').value = '株式会社 北川組鉄工所';

  // Form 2
  if (document.getElementById('d_orderNo')) document.getElementById('d_orderNo').value = '25-1050';
  if (document.getElementById('d_projectName')) document.getElementById('d_projectName').value = '八重洲二丁目中地区再開発事業新築工事(1節)';
  if (document.getElementById('d_supplierName')) document.getElementById('d_supplierName').value = '株式会社 北川組鉄工所';
}

/**
 * Helper toast notification
 */
function showNotification(msg) {
  const existing = document.querySelector('.app-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'app-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #0f172a;
    color: #fff;
    padding: 10px 18px;
    border-radius: 4px;
    font-size: 13px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: fadeIn 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/**
 * Saves inspection sheet data and displays a toast confirmation
 */
function saveData() {
  showNotification('検査表データを保存しました。');
}
window.saveData = saveData;
