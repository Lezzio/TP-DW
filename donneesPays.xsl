<?xml version="1.0"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:param name="countryCode"/>
    <xsl:param name="countryCodeLowerCase"/>
    <xsl:param name="currencyInfo"/>
    <xsl:param name="currencyValue"/>

    <xsl:template match="/">
        <html>
            <div id="country-data-render">
                <div id="country-data-title" style="text-align: center; font-weight: 700; font-size: 16px; margin-bottom: 4px;">Data of the country : </div>
                <table>
                    <thead>
                        <tr>
                            <th style="text-align: center">Nom</th>
                            <th style="text-align: center">Capitale</th>
                            <th style="text-align: center">Drapeau</th>
                            <xsl:if test="$currencyInfo = 'true'">
                                <th style="text-align: center">Devise</th>
                            </xsl:if>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="text-align: center; min-width: 260px;">
                                <xsl:value-of
                                        select="//country[country_codes/cca2 = $countryCode]/country_name/common_name"/>
                            </td>
                            <td style="text-align: center; min-width: 260px;">
                                <xsl:value-of select="//country[country_codes/cca2 = $countryCode]/capital"/>
                            </td>
                            <td style="min-width: 260px;">
                                <img style="margin-left: 100px" alt="" height="40" width="60">
                                    <xsl:attribute name="src">
                                        <xsl:value-of select="concat('http://www.geonames.org/flags/x/', $countryCodeLowerCase, '.gif')"/>
                                    </xsl:attribute>
                                </img>
                            </td>
                            <xsl:if test="$currencyInfo = 'true'">
                                <td style="text-align: center; min-width: 260px;">
                                    <xsl:value-of select="$currencyValue"/>
                                    <!--<xsl:value-of select="document('https://restcountries.eu/rest/v2/alpha/fr')"/> -->
                                </td>
                            </xsl:if>
                        </tr>
                    </tbody>
                </table>
            </div>
        </html>
    </xsl:template>

</xsl:stylesheet>