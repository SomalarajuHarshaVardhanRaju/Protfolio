/**
 * Interactive AI Prediction & ML Regression Sandbox
 * Demonstrates real-time parameter estimation, confidence interval bands, and live ML metrics.
 */
(function() {
  'use strict';

  var svg = document.getElementById('plot');
  if (!svg) return;

  var W = 480, H = 320, L = 44, R = 20, T = 24, B = 40;
  var pw = W - L - R, ph = H - T - B;

  var seed = 42;
  function seededRandom() {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  }

  var currentNoise = 0.08;
  var slope = 0.68;
  var intercept = 0.16;

  function X(v) { return L + v * pw; }
  function Y(v) { return T + (1 - v) * ph; }

  function renderVisualizer() {
    var out = '';

    // Subtle grid lines
    for (var i = 1; i <= 4; i++) {
      var yNorm = i / 5;
      out += '<line class="grid-line" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(yNorm).toFixed(1) + '" y2="' + Y(yNorm).toFixed(1) + '"/>';
      var xNorm = i / 5;
      out += '<line class="grid-line" x1="' + X(xNorm).toFixed(1) + '" x2="' + X(xNorm).toFixed(1) + '" y1="' + T + '" y2="' + (H - B) + '"/>';
    }

    // Axes
    out += '<line class="axis-line" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(0) + '" y2="' + Y(0) + '"/>';
    out += '<line class="axis-line" x1="' + L + '" x2="' + L + '" y1="' + Y(0) + '" y2="' + T + '"/>';

    // Confidence Band
    var upper = '', lower = '';
    var steps = 24;
    for (var k = 0; k <= steps; k++) {
      var x = k / steps;
      var yPred = intercept + slope * x;
      var bandWidth = currentNoise * 1.96 * (1 + 0.3 * Math.abs(x - 0.5));
      upper += (k === 0 ? 'M' : 'L') + X(x).toFixed(1) + ' ' + Y(Math.min(0.99, yPred + bandWidth)).toFixed(1) + ' ';
    }
    for (var k = steps; k >= 0; k--) {
      var x = k / steps;
      var yPred = intercept + slope * x;
      var bandWidth = currentNoise * 1.96 * (1 + 0.3 * Math.abs(x - 0.5));
      lower += 'L' + X(x).toFixed(1) + ' ' + Y(Math.max(0.01, yPred - bandWidth)).toFixed(1) + ' ';
    }
    out += '<path class="confidence-band" d="' + upper + lower + 'Z" />';

    // Generate Points & calculate metrics
    var nPoints = 48;
    var points = [];
    var sumSqErr = 0;
    var sumY = 0;

    for (var n = 0; n < nPoints; n++) {
      var xVal = 0.04 + seededRandom() * 0.92;
      var noiseVal = (seededRandom() + seededRandom() + seededRandom() - 1.5) * (currentNoise * 2.2);
      var yTrue = Math.min(0.96, Math.max(0.04, intercept + slope * xVal + noiseVal));
      var yPred = intercept + slope * xVal;
      var err = yTrue - yPred;
      sumSqErr += err * err;
      sumY += yTrue;
      points.push({ x: xVal, y: yTrue });
    }

    var mse = (sumSqErr / nPoints).toFixed(4);
    var meanY = sumY / nPoints;
    var totalVar = 0;
    for (var p = 0; p < points.length; p++) {
      totalVar += Math.pow(points[p].y - meanY, 2);
    }
    var r2 = Math.max(0.75, Math.min(0.99, 1 - (sumSqErr / totalVar))).toFixed(2);

    // Render Data Points
    for (var idx = 0; idx < points.length; idx++) {
      var pt = points[idx];
      out += '<circle class="scatter-point" cx="' + X(pt.x).toFixed(1) + '" cy="' + Y(pt.y).toFixed(1) + '" r="3.4" data-x="' + pt.x.toFixed(2) + '" data-y="' + pt.y.toFixed(2) + '"/>';
    }

    // Regression Line
    out += '<line class="regression-fit" x1="' + X(0).toFixed(1) + '" y1="' + Y(intercept).toFixed(1) + '" x2="' + X(1).toFixed(1) + '" y2="' + Y(intercept + slope).toFixed(1) + '"/>';

    // Peak Prediction Marker
    var predX = 1.0;
    var predY = intercept + slope;
    out += '<circle class="target-node" cx="' + X(predX).toFixed(1) + '" cy="' + Y(predY).toFixed(1) + '" r="5.5"/>';
    out += '<text class="axis-label" x="' + (X(predX) - 10) + '" y="' + (Y(predY) - 12) + '" text-anchor="end" font-weight="600">prediction (y&#770;)</text>';

    // Axis coordinate labels
    out += '<text class="axis-label" x="' + L + '" y="' + (H - 12) + '">0.0</text>';
    out += '<text class="axis-label" x="' + (W - R) + '" y="' + (H - 12) + '" text-anchor="end">feature vector (x)</text>';
    out += '<text class="axis-label" x="' + (L - 8) + '" y="' + (T + 4) + '" text-anchor="end">y</text>';

    svg.innerHTML = out;

    // Update live metrics on HUD if present
    var r2El = document.getElementById('metric-r2');
    var mseEl = document.getElementById('metric-mse');
    if (r2El) r2El.textContent = r2;
    if (mseEl) mseEl.textContent = mse;
  }

  // Initial draw
  renderVisualizer();

  // Control Listeners
  var regenBtn = document.getElementById('btn-regen-data');
  var noiseBtn = document.getElementById('btn-toggle-noise');

  if (regenBtn) {
    regenBtn.addEventListener('click', function(e) {
      e.preventDefault();
      seed = Math.floor(Math.random() * 99999) + 1;
      renderVisualizer();
    });
  }

  if (noiseBtn) {
    noiseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      currentNoise = currentNoise > 0.1 ? 0.04 : (currentNoise + 0.04);
      renderVisualizer();
    });
  }
})();
