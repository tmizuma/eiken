# Kubernetes Deployment Configuration

Configuration guide for scheduling batch commands to run periodically on Kubernetes.

## Repository

`kouzoh/microservices-kubernetes` - Manages Kubernetes job configurations

## File Structure

```
kit/microservices/mercari-api-jp/
├── batch-{feature-name}.cue           # Batch definition file
├── development/
│   └── batch.cue                      # Registration for development environment
├── staging/
│   └── batch.cue                      # Registration for staging environment
└── production/
    └── batch.cue                      # Registration for production environment
```

## 1. Create Batch Definition File

`kit/microservices/mercari-api-jp/batch-{feature-name}.cue`:

```cue
package mercari_api_jp

Batch: "{feature-name}": {
    spec: {
        cron: {
            // Schedule is in UTC (JST = UTC + 9)
            // Example: JST 10:00 on 1st = UTC 01:00 on 1st
            schedule: "0 1 1 * *"    // cron format: min hour day month weekday
            policy:   "forbid"       // Forbid new execution if previous is running
        }
        args: [...string] | *["/bin/sh", "-c", "bash /init.sh && php /opt/project/bin/console mercari:{feature-name}"]
        resources: {
            requests: {cpu: 0.2, memory: 256Mi}
            limits: {cpu: 0.6, memory: 256Mi}
        }
    }
}
```

## 2. Register in Environment batch.cue

Add to each environment's `batch.cue`:

**development/batch.cue:**
```cue
package mercari_api_jp

import (
    kbatch "kit.kouzoh.com/kit/microservices/mercari-api-jp:batch-{feature-name}"
)

Batch: kbatch.Batch
```

Similarly add to `staging/batch.cue` and `production/batch.cue`.

## Cron Schedule Reference

| Format | Meaning |
|--------|---------|
| `"0 1 1 * *"` | 1st of month 01:00 UTC (= 10:00 JST) |
| `"0 0 * * *"` | Daily 00:00 UTC (= 09:00 JST) |
| `"0 15 * * 1"` | Monday 15:00 UTC (= Tuesday 00:00 JST) |
| `"*/30 * * * *"` | Every 30 minutes |

**Important**: Schedule is in **UTC**. Subtract 9 hours from JST.

## Resource Guidelines

| Scale | CPU requests | CPU limits | memory |
|-------|-------------|------------|--------|
| Small (~1000 records) | 0.1 | 0.3 | 128Mi |
| Medium (~10000 records) | 0.2 | 0.6 | 256Mi |
| Large (10000+ records) | 0.5 | 1.0 | 512Mi |

## PR Creation

```bash
cd microservices-kubernetes
git checkout -b add-{feature-name}-batch
# Add files above
gh pr create --title "Add {feature-name} batch job" --body "..."
```

## Kubernetes Checklist

- [ ] Create batch definition file `batch-{feature-name}.cue`
- [ ] Register in development/batch.cue
- [ ] Register in staging/batch.cue
- [ ] Register in production/batch.cue
- [ ] Set cron schedule correctly in UTC
- [ ] Set appropriate resource limits
