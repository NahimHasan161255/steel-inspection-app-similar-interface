/* ==========================================================================
   B-BOX PRODUCT INSPECTION SHEET - INTERACTIVE LOGIC (src/app.js)
   Auto Difference Calculation, Out-of-Tolerance Alerts & Print Actions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('B-BOX Product Inspection Sheet System initialized.');

  // DOM Elements
  const btnCalculate = document.getElementById('btnCalculate');
  const btnPrint = document.getElementById('btnPrint');
  const btnLoadSample = document.getElementById('btnLoadSample');

  // Trigger calculation on input change
  const calcInputs = document.querySelectorAll('.calc-trigger');
  calcInputs.forEach(input => {
    input.addEventListener('input', calculateAllDifferences);
    input.addEventListener('change', calculateAllDifferences);
  });

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
 * Calculates all difference (差) fields: 実測値 (Actual) - 設計値 (Design)
 */
function calculateAllDifferences() {
  // 1. Overall Length (全長)
  calcPair('lenDesign', 'lenActual', 'lenDiff', 'lenTol');

  // 2. Diaphragm Positions 1 to 9 (ダイアフラム位置 1~9)
  for (let i = 1; i <= 9; i++) {
    calcPair(`dia${i}_design`, `dia${i}_actual`, `dia${i}_diff`, `dia${i}_tol`);
  }

  // 3. Column Top (柱頭 N, S, E, W)
  calcPair('head_n_design', 'head_n_actual', 'head_n_diff', 'head_n_tol');
  calcPair('head_s_design', 'head_s_actual', 'head_s_diff', 'head_s_tol');
  calcPair('head_e_design', 'head_e_actual', 'head_e_diff', 'head_e_tol');
  calcPair('head_w_design', 'head_w_actual', 'head_w_diff', 'head_w_tol');

  // 4. Column Base (柱脚 N, S, E, W)
  calcPair('base_n_design', 'base_n_actual', 'base_n_diff', 'base_n_tol');
  calcPair('base_s_design', 'base_s_actual', 'base_s_diff', 'base_s_tol');
  calcPair('base_e_design', 'base_e_actual', 'base_e_diff', 'base_e_tol');
  calcPair('base_w_design', 'base_w_actual', 'base_w_diff', 'base_w_tol');

  // 5. Bending & Twist (曲り E面, S面 & ねじれ δ)
  calcPair('bend_e_design', 'bend_e_actual', 'bend_e_diff', 'bend_e_tol');
  calcPair('bend_s_design', 'bend_s_actual', 'bend_s_diff', 'bend_s_tol');
  calcPair('twist_design', 'twist_actual', 'twist_diff', 'twist_tol');

  // 6. Check Overall Final Verdict
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

  // Formatting integers as +3, +1, -1 (matching Picture 2)
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
  if (tolEl && tolEl.value) {
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
  if (!finalVerdictEl) return;

  const ngElements = document.querySelectorAll('.diff-ng');
  if (ngElements.length > 0) {
    finalVerdictEl.value = '否';
    finalVerdictEl.className = 'input-cell text-center font-bold verdict-fail text-red';
  } else {
    finalVerdictEl.value = '合';
    finalVerdictEl.className = 'input-cell text-center font-bold verdict-pass';
  }
}

/**
 * Preloads exact sample data from Picture 2
 */
function loadSampleData() {
  document.getElementById('orderNo').value = '25-1050';
  document.getElementById('projectName').value = '八重洲二丁目地区再開発事業新築工事(1節)';
  document.getElementById('supplierName').value = '株式会社 北川組鉄工所';
  document.getElementById('itemNo').value = '①-1';
  document.getElementById('columnMark').value = 'K-1CX5Y14';
  document.getElementById('dimSpec').value = '950 × 950 × 50 / 50 × 7,003';

  // Length
  document.getElementById('lenDesign').value = '7003.0';
  document.getElementById('lenActual').value = '7006.0';
  document.getElementById('lenTol').value = '±3.0';

  // Diaphragms
  document.getElementById('dia1_design').value = '1253.0';
  document.getElementById('dia1_actual').value = '1254.0';
  document.getElementById('dia1_tol').value = '±3.0';

  document.getElementById('dia2_design').value = '2257.0';
  document.getElementById('dia2_actual').value = '2256.0';
  document.getElementById('dia2_tol').value = '±3.0';

  // Column Top
  document.getElementById('head_n_design').value = '950';
  document.getElementById('head_s_design').value = '950';
  document.getElementById('head_e_design').value = '950';
  document.getElementById('head_w_design').value = '950';

  document.getElementById('head_n_actual').value = '950';
  document.getElementById('head_s_actual').value = '949';
  document.getElementById('head_e_actual').value = '951';
  document.getElementById('head_w_actual').value = '951';

  // Column Base
  document.getElementById('base_n_design').value = '950';
  document.getElementById('base_s_design').value = '950';
  document.getElementById('base_e_design').value = '950';
  document.getElementById('base_w_design').value = '950';

  document.getElementById('base_n_actual').value = '952';
  document.getElementById('base_s_actual').value = '952';
  document.getElementById('base_e_actual').value = '953';
  document.getElementById('base_w_actual').value = '952';

  // Bending & Twist
  document.getElementById('bend_e_design').value = '0';
  document.getElementById('bend_e_actual').value = '-0.5';
  document.getElementById('bend_s_design').value = '0';
  document.getElementById('bend_s_actual').value = '0';
  document.getElementById('twist_design').value = '0';
  document.getElementById('twist_actual').value = '1.5';

  // Status
  document.getElementById('thicknessStatus').value = '適';
  document.getElementById('materialStatus').value = '適';
  document.getElementById('appearanceStatus').value = '適';
  document.getElementById('inspectDate').value = '9/4';
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
