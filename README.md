# Stock_Master_Gear_5

Lightweight Odoo add-on to extend stock/warehouse workflows and material master capabilities for the Gear 5 project.

## Overview
Provides customizations and utilities for inventory management:
- Extended product/stock master fields
- Warehouse/operation improvements
- Reports and views tailored for Gear 5 workflows

## Features
- Custom product and stock master attributes
- Extra views and form enhancements for inventory operations
- Security rules for stock-related records
- Import/ export helpers for master data
- Basic automated tests (if included)

## Requirements
- Odoo 14+ (adjust version in manifest as needed)
- Python 3.8+
- Standard Odoo dependencies (see `requirements.txt` if present)

## Installation
1. Copy the `Stock_Master_Gear_5` folder to your Odoo `addons` path.
2. Restart the Odoo server.
3. Update the Apps list and install "Stock Master Gear 5" from Apps.
4. Check Access Rights: Settings → Users → Groups to assign any new groups.

Command-line example:
```
# from Odoo root
./odoo-bin -c /path/to/odoo.conf -u all
```

## Configuration
- Configure warehouses and routes in Inventory → Configuration.
- Fill extended product master fields in Inventory → Products → Products.
- Set required access rights under Settings → Users → Groups.

## Usage
- Use extended product forms to manage master attributes.
- Use enhanced stock views for picking, inventory adjustments, and reporting.
- Consult the module menu (Inventory → Gear 5) for any custom reports or wizards.

## Development
Module layout (typical)
- __manifest__.py — module metadata
- models/ — python models and business logic
- views/ — XML views, menus, actions
- security/ — access control and record rules
- data/ — demo/static data and CSV imports
- tests/ — automated tests

To run tests:
```
pytest --maxfail=1 --disable-warnings -q
```
(adapt to project test runner)

## Contributing
- Fork the repo, create a feature branch, submit a PR with clear changelog and tests.
- Follow Odoo coding conventions and add/ update manifest version when needed.

## Troubleshooting
- Clear Odoo cache if views do not update: restart server and upgrade module.
- Check logs for Traceback and missing dependencies.

## License
Specify a license in `LICENSE` (e.g., MIT, AGPL-3). If unsure, add a LICENSE file or request clarification.

---

If you want, provide the repository contents or the module files and I will generate a tailored README with exact features, installation commands, and configuration steps.