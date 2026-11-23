fetch(`${BDV_ADMIN_API_URL}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(pin)}`)
        .then(r => r.json())
        .then(res => {
          if (!res.ok || !res.project) {
            resBox.innerHTML = `
              <p style="font-size: 0.82rem; color: #f87171; margin: 0;">
                ${lang === "en" ? "Credentials not found or expired. Check your welcome email or contact management." : "Credenciales no encontradas o expiradas. Revisa tu correo de bienvenida o contacta a soporte."}
              </p>
            `;
            return;
          }

          const matched = res.project;

          if (matched.accessStatus === "DISABLED" || matched.stage === 6) {
            resBox.innerHTML = `
              <span class="bdv-tracker-status-tag bdv-status-disabled">Acceso Expirado / Inhabilitado</span>
              <h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">Proyecto Liquidado al 100%</h4>
              <p style="font-size: 0.8rem; color: #94a3b8; margin: 4px 0;">El software fue entregado y las credenciales maestras fueron traspasadas. El visor temporal ha concluido. Para soporte técnico continuo, contacte una póliza mensual.</p>
            `;
          } else {
            const stObj = workflowStages[matched.stage - 1] || workflowStages[0];
            const stName = lang === "en" ? stObj.name_en : stObj.name_es;
            resBox.innerHTML = `
              <span class="bdv-tracker-status-tag bdv-status-active">Acceso Activo · Obra en Progreso</span>
              <h4 style="margin: 4px 0; font-size: 0.95rem; color: #f8fafc;">Etapa ${matched.stage}/6: ${stName} (${stObj.percentage}%)</h4>
              <p style="font-size: 0.8rem; color: #cbd5e1; margin: 6px 0;"><strong>Proyecto:</strong> ${matched.name} (${matched.id})</p>
              <p style="font-size: 0.8rem; color: #e8c861; margin: 6px 0;"><strong>Estado Financiero:</strong> ${matched.paymentStatus}</p>
              <div class="bdv-progress-track" style="margin-top: 8px;">
                <div class="bdv-progress-fill" style="width: ${stObj.percentage}%;"></div>
              </div>
            `;
          }
        })
        .catch(() => {
          resBox.innerHTML = `
            <p style="font-size: 0.82rem; color: #f87171; margin: 0;">
              ${lang === "en" ? "Connection error. Please try again." : "Error al conectar con el servidor. Intenta de nuevo."}
            </p>
          `;
        });
