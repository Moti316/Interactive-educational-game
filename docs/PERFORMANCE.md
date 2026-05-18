# PERFORMANCE — יעדי-ביצועים ומדידות

## יעדים

- **FCP** (First Contentful Paint): < 1s ב-localhost
- **TTI** (Time to Interactive): < 2s
- **Initial Bundle:** ≤ 80KB
- **Per-task transferred:** ≤ 50KB
- **30min session total:** ≤ 800KB
- **Memory after 30min:** < 100MB
- **Memory growth:** < 50MB ב-30 דק'
- **Animation FPS:** 60fps יציב

## מדידה

### Lighthouse CI
```powershell
powershell -File scripts/audit.ps1
```r

### Long-Task Observer
```js
// dev-mode: התראה על task > 50ms
new PerformanceObserver(list => { ... }).observe({ type: 'longtask' });
```r

### Memory Sampler
```js
// dev-mode: snapshot כל 5 דקות
setInterval(() => console.log(performance.memory), 300000);
```r

## מדידות-בפועל

*ריק — יתמלא בשלב 8 (ליטוש).*