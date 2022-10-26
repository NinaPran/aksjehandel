﻿using aksjehandel.DAL;
using aksjehandel.Models;
using Castle.Core.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace aksjehandel.Controllers
{
    [Route("[controller]/[action]")]
    public class StockController : ControllerBase
    {
        private readonly IStockRepository _db;

        private ILogger<StockController> _log;
        private const string _signedIn = "signedIn";
        public StockController(IStockRepository db, ILogger<StockController> log)
        {
            _db = db;
            _log = log;
        }
        // Virtuell funksjon så vi kan mocke den for unit-testene
        public virtual bool IsLoggedIn()
        {
            return string.IsNullOrEmpty(HttpContext.Session.GetString(_signedIn));
        }
        public async Task<ActionResult> regOrder(Order newOrder)
        {
            if (!IsLoggedIn())
            {
                return Unauthorized();
            }
            if (ModelState.IsValid)
            {
                bool returnOK = await _db.RegOrder(newOrder);
                if (!returnOK)
                {
                    _log.LogInformation("Ordren ble ikke lagret");
                    return BadRequest("Ordren ble ikke lagret");
                }
                return Ok("Ordre lagret");
            }
            _log.LogInformation("Feil i inputvalidering");
            return BadRequest("Feil i inputvalidering");
        }
        public async Task<ActionResult> DeleteOrder(int id)
        {
            if (!IsLoggedIn())
            {
                return Unauthorized();
            }
            bool returnOK = await _db.DeleteOrder(id);
            if (!returnOK)
            {
                _log.LogInformation("Ordren ble ikke slettet");
                return NotFound("Ordren ble ikke slettet");
            }
            return Ok("Ordren slettet");
        }
        public async Task<ActionResult> ChangeOrder(Order changeOrder)
        {
            if (!IsLoggedIn())
            {
                return Unauthorized();
            }
            if (ModelState.IsValid)
            {
                bool returnOk = await _db.ChangeOrder(changeOrder);
                if (!returnOk)
                {
                    _log.LogInformation("Ordren ble ikke endret");
                    return NotFound("Ordren ble ikke endret");
                }
                return Ok("Ordren endret");
            }
            _log.LogInformation("Feil i inputvalidering");
            return BadRequest("Feil i inputvalidering");
        }
        public async Task<ActionResult> GetOneOrder(int id)
        {
            if (!IsLoggedIn())
            {
                return Unauthorized();
            }
            Order oneOrder = await _db.GetOneOrder(id);
            if (oneOrder == null)
            {
                _log.LogInformation("Fant ikke ordren");
                return NotFound("Fant ikke ordren");
            }
            return Ok(oneOrder);
        }
        public async Task<ActionResult> getAllOrders(int portfolioId)
        {
            if (!IsLoggedIn())
            {
                return Unauthorized();
            }
            List<Order> allOrders = await _db.GetAllOrders(portfolioId);
            return Ok(allOrders);

        }
        public async Task<ActionResult> GetAllShareholdings(int portfolioId)
        {
            if (!IsLoggedIn())
            {
                return Unauthorized();
            }
            List<Shareholding> allShareholdings = await _db.GetAllShareholdings(portfolioId);
            return Ok(allShareholdings);
        }
        public async Task<ActionResult> GetAllPortfolios()
        {
            if (!IsLoggedIn())
            {
                return Unauthorized();
            }
            List<Portfolio> allPortfolios = await _db.GetAllPortfolios();
            return Ok(allPortfolios);
        }
        public async Task<ActionResult> GetAllCompanies()
        {
            if (!IsLoggedIn())
            {
                return Unauthorized();
            }
            List<Company> allCompanies = await _db.GetAllCompanies();
            return Ok(allCompanies);

        }
        public async Task<ActionResult> GetAllTrades()
        {
            if (!IsLoggedIn())
            {
                return Unauthorized();
            }
            List<Trade> allTrades = await _db.GetAllTrades();
            return Ok(allTrades);
        }

        public async Task<ActionResult> SignIn(User user)
        {
            if (ModelState.IsValid)
            {
                bool returnOk = await _db.SignIn(user);
                if (!returnOk)
                {
                    _log.LogInformation("Innloggingen feilet for bruker. Brukernavn: " + user.Username);
                    HttpContext.Session.SetString(_signedIn, "");
                    return Ok(false);
                }
                HttpContext.Session.SetString(_signedIn, "signedIn");
                return Ok(true);
            }
            _log.LogInformation("Feil i inputvalidering");
            return BadRequest("Feil i inputvalidering på server");
        }

        public void SignOut()
        {
            HttpContext.Session.SetString(_signedIn, "");
        }

    }
}
