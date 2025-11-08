# Quick Fix for Firebase Auth Issues

## Problem
The service account doesn't have billing enabled or proper permissions.

## Solutions (Choose One):

### Solution 1: Enable Billing (Recommended - Free Tier Available)
1. Go to: https://console.firebase.google.com/project/e-commerce-website-50049/settings/general/billing
2. Click "Modify plan"
3. Choose "Blaze (Pay as you go)" - Free for low usage
4. This automatically grants necessary permissions

### Solution 2: Grant IAM Permissions
1. Go to: https://console.cloud.google.com/iam-admin/iam?project=e-commerce-website-50049
2. Find: `firebase-adminsdk-fbsvc@e-commerce-website-50049.iam.gserviceaccount.com`
3. Click edit (pencil icon)
4. Add role: "Service Usage Consumer"
5. Save

### Solution 3: Use Mock Auth (Works Immediately)
The demo will work with temporary local authentication until Firebase is properly configured.

## After Fixing:
Restart your backend server and try signup/login again.

## Test Command:
```powershell
$body = @{ name="Test"; email="test@test.com"; password="test123" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/auth/signup -Method POST -Body $body -ContentType "application/json"
```

If you see `"success":true`, it's working!
