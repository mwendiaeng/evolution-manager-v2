<template>
  <v-dialog v-model="dialog" max-width="850px" scrollable>
    <v-card>
      <!-- Título do Card com contagem de sessões e botão de atualização -->
      <v-card-title class="d-flex align-center">
        {{ $t("typebot.session.title") }}
        <v-spacer />
        <h3>{{ sessions.length }}</h3>
        <v-btn
          @click="$emit('refresh')"
          icon
          :loading="loading"
          size="small"
          variant="text"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <!-- Tabela de dados com Vuetify Data Table -->
        <v-data-table
          :headers="headers"
          :items="sessions"
          :no-data-text="
            loading ? `${$t('loading')}...` : $t('typebot.session.noData')
          "
          :rows-per-page-items="[10, 25, 50, 100]"
        >
          <!-- Slot para manipular dados da coluna 'remoteJid' -->
          <template v-slot:item.remoteJid="{ item }">
            <a :href="`https://wa.me/${item.remoteJid.split('@')[0]}`">
              {{ item.remoteJid.split("@")[0] }}
            </a>
          </template>
          <!-- Slot para manipular dados da coluna 'status' -->
          <template v-slot:item.status="{ item }">
            <v-chip :color="item.status.color" label size="small">
              <v-icon start>{{ item.status.icon }}</v-icon>
              {{ $t(`typebot.status.${item.status.id}`) }}
            </v-chip>
          </template>
          <!-- Slot para manipular dados da coluna 'variables' -->
          <template v-slot:item.variables="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ props }">
                <v-chip color="primary" label size="small" v-bind="props">
                  {{ Object.entries(item.prefilledVariables).length }}
                </v-chip>
              </template>
              <div>
                <p
                  v-for="[key, value] of Object.entries(
                    item.prefilledVariables
                  )"
                  :key="key"
                >
                  <b>{{ key }}:</b> {{ value }}
                </p>
              </div>
            </v-tooltip>
          </template>
          <!-- Slot para manipular dados da coluna 'createdAt' -->
          <template v-slot:item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
          <!-- Slot para manipular dados da coluna 'updateAt' -->
          <template v-slot:item.updateAt="{ item }">
            {{ formatDate(item.updateAt) }}
          </template>
          <!-- Slot para manipular dados da coluna 'actions' -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex flex-wrap align-center justify-end">
              <!-- Botão para iniciar sessão pausada -->
              <v-btn
                v-if="item.status.id === 'paused'"
                variant="text"
                color="success"
                icon
                size="small"
                :loading="
                  loadingInner?.remoteJid === item.remoteJid &&
                  loadingInner?.status === 'opened'
                "
                :disabled="!!loadingInner"
                @click="changeStatus(item, 'opened')"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <!-- Botão para pausar sessão aberta -->
              <v-btn
                v-if="item.status.id === 'opened'"
                variant="text"
                color="info"
                icon
                size="small"
                :loading="
                  loadingInner?.remoteJid === item.remoteJid &&
                  loadingInner?.status === 'paused'
                "
                :disabled="!!loadingInner"
                @click="changeStatus(item, 'paused')"
              >
                <v-icon>mdi-pause</v-icon>
              </v-btn>
              <!-- Botão para fechar sessão -->
              <v-btn
                variant="text"
                color="error"
                icon
                size="small"
                :loading="
                  loadingInner?.remoteJid === item.remoteJid &&
                  loadingInner?.status === 'closed'
                "
                :disabled="!!loadingInner"
                @click="changeStatus(item, 'closed')"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
      <!-- Ações do Card -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false" :disabled="loading || loadingInner">
          {{ $t("close") }}
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import typebotStatus from "@/helpers/mappers/typebotStatus";
import instanceController from "@/services/instanceController";

export default {
  name: "TypebotSessionsDialog",
  data() {
    return {
      dialog: false,
      typebotStatus,
      headers: [
        { text: "Whatsapp", value: "remoteJid" },
        { text: "Status", value: "status" },
        { text: this.$t("typebot.session.headers.variables"), value: "variables" },
        { text: this.$t("typebot.session.headers.createdAt"), value: "createdAt" },
        { text: this.$t("typebot.session.headers.updatedAt"), value: "updateAt" },
        { text: "", value: "actions" },
      ],
      loadingInner: false,
    };
  },
  methods: {
    // Método para abrir o diálogo de sessões
    open() {
      this.dialog = true;
    },
    // Formata a data para exibição legível
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    // Altera o status da sessão (abre, pausa, fecha)
    async changeStatus(session, status) {
      try {
        const { remoteJid } = session;
        const data = {
          remoteJid,
          status,
        };
        this.loadingInner = data;

        // Chama o serviço para alterar o status da sessão
        await instanceController.typebot.changeStatus(
          this.instance.instance.instanceName,
          data
        );

        // Emite evento para atualizar os dados após a alteração
        this.$emit("refresh");
      } catch (error) {
        console.error("Erro ao alterar status da sessão:", error);
      } finally {
        this.loadingInner = false;
      }
    },
  },
  computed: {
    // Computa as sessões formatadas com status traduzidos
    sessions() {
      return this.data.sessions.map(session => ({
        ...session,
        status: { ...typebotStatus[session.status], id: session.status },
      }));
    },
  },
  props: {
    // Propriedades recebidas pelo componente
    instance: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
